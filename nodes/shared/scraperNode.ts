import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from "n8n-workflow";
import { NodeConnectionTypes, NodeOperationError } from "n8n-workflow";
import { BASE_URL, URL_SPLIT_RE, httpWithRetry } from "./api";
import { pollForResults } from "./polling";
import type { ScraperNodeConfig } from "./types";

function buildDescription(config: ScraperNodeConfig): INodeTypeDescription {
	return {
		displayName: config.displayName,
		name: config.nodeName,
		icon: {
			light: `file:${config.platform}.svg`,
			dark: `file:${config.platform}.dark.svg`,
		},
		group: ["input"],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: config.description,
		defaults: { name: config.displayName },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: "scraperNodeApi", required: true }],
		properties: [
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				options: [
					{
						name: "Create",
						value: "create",
						action: `Scrape ${config.inputLabel.toLowerCase()}`,
						description: config.description,
					},
					{
						name: "Get",
						value: "get",
						action: "Get job status",
						description: "Get job status and details by ID",
					},
					{
						name: "Get Results",
						value: "getResults",
						action: "Get scrape results",
						description: "Get results from a completed job",
					},
				],
				default: "create",
			},
			// -- Create fields --
			{
				displayName: config.inputLabel,
				name: "urls",
				type: "string",
				default: "",
				required: true,
				displayOptions: { show: { operation: ["create"] } },
				description: config.inputDescription,
				placeholder: config.inputPlaceholder,
				typeOptions: { rows: 4 },
			},
			{
				displayName: "Job Name",
				name: "jobName",
				type: "string",
				default: "",
				displayOptions: { show: { operation: ["create"] } },
				description: "Optional name for this job",
			},
			{
				displayName: "Wait for Completion",
				name: "waitForCompletion",
				type: "boolean",
				default: false,
				displayOptions: { show: { operation: ["create"] } },
				description:
					"Whether to wait for the job to finish and return results. WARNING: Holds an n8n worker while polling — use a separate Get node on a schedule for long-running jobs.",
			},
			{
				displayName: "Polling Interval (Seconds)",
				name: "pollInterval",
				type: "number",
				default: 10,
				displayOptions: {
					show: { operation: ["create"], waitForCompletion: [true] },
				},
				description: "How often to check if the job is done",
			},
			{
				displayName: "Max Wait Time (Seconds)",
				name: "maxWait",
				type: "number",
				default: 300,
				displayOptions: {
					show: { operation: ["create"], waitForCompletion: [true] },
				},
				description: "Maximum time to wait before timing out",
			},
			{
				displayName: "Result Limit",
				name: "resultLimit",
				type: "number",
				default: 1000,
				displayOptions: {
					show: { operation: ["create"], waitForCompletion: [true] },
				},
				description: "Maximum number of results to fetch after job completion",
			},
			// -- Get / Get Results fields --
			{
				displayName: "Job ID",
				name: "jobId",
				type: "string",
				default: "",
				required: true,
				displayOptions: { show: { operation: ["get", "getResults"] } },
				description: "The ID of the scrape job",
			},
			{
				displayName: "Return All",
				name: "returnAll",
				type: "boolean",
				default: false,
				displayOptions: { show: { operation: ["getResults"] } },
				description:
					"Whether to return all results or only up to a given limit",
			},
			{
				displayName: "Limit",
				name: "limit",
				type: "number",
				default: 50,
				displayOptions: {
					show: { operation: ["getResults"], returnAll: [false] },
				},
				description: "Max number of results to return",
				typeOptions: { minValue: 1 },
			},
		],
	};
}

export function buildScraperNodeClass(
	config: ScraperNodeConfig
): new () => INodeType {
	const desc = buildDescription(config);

	return class implements INodeType {
		description = desc;

		async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
			const items = this.getInputData();
			const returnData: INodeExecutionData[] = [];
			await this.getCredentials("scraperNodeApi");
			const baseUrl = BASE_URL;

			for (let i = 0; i < items.length; i++) {
				try {
					const operation = this.getNodeParameter("operation", i) as string;
					const results = await executeScraperOperation(
						this,
						operation,
						i,
						baseUrl,
						config.scraperId,
						config.allowedDomains
					);
					for (const item of results) {
						returnData.push({ ...item, pairedItem: { item: i } });
					}
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({
							json: {
								error: error instanceof Error ? error.message : "Unknown error",
							},
							pairedItem: { item: i },
						});
					} else {
						throw new NodeOperationError(this.getNode(), error as Error, {
							itemIndex: i,
						});
					}
				}
			}

			return [returnData];
		}
	};
}

async function executeScraperOperation(
	ctx: IExecuteFunctions,
	operation: string,
	i: number,
	baseUrl: string,
	scraperId: string,
	allowedDomains: string[]
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case "create": {
			const result = await createScrapeJob(
				ctx,
				i,
				baseUrl,
				scraperId,
				allowedDomains
			);
			return Array.isArray(result) ? result : [result];
		}
		case "get": {
			const jobId = ctx.getNodeParameter("jobId", i) as string;
			const response = await httpWithRetry(ctx, {
				method: "GET",
				url: `${baseUrl}/api/jobs/get?jobId=${encodeURIComponent(jobId)}`,
				json: true,
			});
			return [{ json: (response.job ?? response) as IDataObject }];
		}
		case "getResults": {
			const jobId = ctx.getNodeParameter("jobId", i) as string;
			const returnAll = ctx.getNodeParameter("returnAll", i, false) as boolean;
			const limit = returnAll
				? 10_000
				: (ctx.getNodeParameter("limit", i, 50) as number);
			const response = await httpWithRetry(ctx, {
				method: "GET",
				url: `${baseUrl}/api/jobs/results?jobId=${encodeURIComponent(jobId)}&limit=${limit}`,
				json: true,
			});
			const results = (response.results ?? []) as Array<{ data?: IDataObject }>;
			return results.map((r) => ({
				json: (r.data ?? r) as IDataObject,
			}));
		}
		default:
			return [];
	}
}

function validateUrls(
	urls: string[],
	allowedDomains: string[],
	ctx: IExecuteFunctions,
	itemIndex: number
): void {
	for (const url of urls) {
		if (!/^https?:\/\//i.test(url)) {
			throw new NodeOperationError(
				ctx.getNode(),
				`Invalid URL: "${url}" — must start with http:// or https://`,
				{ itemIndex }
			);
		}
		if (allowedDomains.length > 0) {
			const domainList = allowedDomains.join(", ");
			let hostname: string;
			try {
				hostname = new URL(url).hostname.toLowerCase();
			} catch {
				throw new NodeOperationError(
					ctx.getNode(),
					`Invalid URL: "${url}" — could not parse URL`,
					{ itemIndex }
				);
			}
			const matches = allowedDomains.some(
				(d) => hostname === d || hostname.endsWith(`.${d}`)
			);
			if (!matches) {
				throw new NodeOperationError(
					ctx.getNode(),
					`Wrong platform: "${url}" — expected URLs from ${domainList}`,
					{ itemIndex }
				);
			}
		}
	}
}

async function createScrapeJob(
	ctx: IExecuteFunctions,
	itemIndex: number,
	baseUrl: string,
	scraperId: string,
	allowedDomains: string[]
): Promise<INodeExecutionData | INodeExecutionData[]> {
	const urlsRaw = ctx.getNodeParameter("urls", itemIndex) as string;
	const jobName = ctx.getNodeParameter("jobName", itemIndex, "") as string;
	const waitForCompletion = ctx.getNodeParameter(
		"waitForCompletion",
		itemIndex,
		false
	) as boolean;

	const urls = urlsRaw
		.split(URL_SPLIT_RE)
		.map((u) => u.trim())
		.filter((u) => u.length > 0);

	if (urls.length === 0) {
		throw new NodeOperationError(ctx.getNode(), "No URLs provided", {
			itemIndex,
		});
	}

	validateUrls(urls, allowedDomains, ctx, itemIndex);

	const inputs = urls.map((url) => ({ url }));

	const createResponse = await ctx.helpers.httpRequestWithAuthentication.call(
		ctx,
		"scraperNodeApi",
		{
			method: "POST",
			url: `${baseUrl}/api/jobs/create`,
			body: {
				scraperId,
				name: jobName || undefined,
				inputs,
			},
			json: true,
		}
	);

	const jobId = createResponse.jobId;

	if (!waitForCompletion) {
		return { json: createResponse };
	}

	return pollForResults(ctx, itemIndex, baseUrl, jobId, scraperId);
}
