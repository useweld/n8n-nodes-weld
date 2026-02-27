import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from "n8n-workflow";
import { NodeConnectionTypes, NodeOperationError } from "n8n-workflow";
import { BASE_URL } from "../shared/api";

const SCRAPER_OPTIONS: INodePropertyOptions[] = [
	// LinkedIn
	{
		name: "LinkedIn Profiles",
		value: "linkedin-profiles",
		description: "Extract professional profiles",
	},
	{
		name: "LinkedIn Companies",
		value: "linkedin-companies",
		description: "Extract company data",
	},
	{
		name: "LinkedIn Posts",
		value: "linkedin-posts",
		description: "Extract posts with engagement metrics",
	},
	// Instagram
	{
		name: "Instagram Profiles",
		value: "instagram-profiles",
		description: "Extract profile data",
	},
	{
		name: "Instagram Posts",
		value: "instagram-posts",
		description: "Extract posts with media",
	},
	{
		name: "Instagram Comments",
		value: "instagram-comments",
		description: "Extract comments",
	},
	// TikTok
	{
		name: "TikTok Profiles",
		value: "tiktok-profiles",
		description: "Extract creator profiles",
	},
	{
		name: "TikTok Videos",
		value: "tiktok-posts",
		description: "Extract video data",
	},
	// Twitter/X
	{
		name: "Twitter/X Profiles",
		value: "twitter-profiles",
		description: "Extract profiles",
	},
	{
		name: "Twitter/X Posts",
		value: "twitter-posts",
		description: "Extract tweets",
	},
	// YouTube
	{
		name: "YouTube Channels",
		value: "youtube-channels",
		description: "Extract channel data",
	},
	{
		name: "YouTube Comments",
		value: "youtube-comments",
		description: "Extract video comments",
	},
	// Facebook
	{
		name: "Facebook Profiles/Posts",
		value: "facebook-profiles",
		description: "Extract profile data",
	},
	{
		name: "Facebook Groups",
		value: "facebook-groups",
		description: "Extract group posts",
	},
	// Indeed
	{
		name: "Indeed Job Listings",
		value: "indeed-jobs",
		description: "Extract job postings",
	},
	{
		name: "Indeed Company Profiles",
		value: "indeed-companies",
		description: "Extract company reviews and ratings",
	},
	// Glassdoor
	{
		name: "Glassdoor Companies",
		value: "glassdoor-companies",
		description: "Extract company profiles with ratings",
	},
	{
		name: "Glassdoor Reviews",
		value: "glassdoor-reviews",
		description: "Extract employee reviews",
	},
	{
		name: "Glassdoor Jobs",
		value: "glassdoor-jobs",
		description: "Extract job listings with salary estimates",
	},
	// Yelp
	{
		name: "Yelp Business Profiles",
		value: "yelp-businesses",
		description: "Extract business profiles with ratings",
	},
	{
		name: "Yelp Business Reviews",
		value: "yelp-reviews",
		description: "Extract customer reviews",
	},
	// GitHub
	{
		name: "GitHub Repositories",
		value: "github-repositories",
		description: "Extract repository data",
	},
	// Crunchbase
	{
		name: "Crunchbase Companies",
		value: "crunchbase-companies",
		description: "Extract company data with funding",
	},
];

const MAX_POLL_RETRIES = 3;
const HTTP_5XX_RE = /5\d{2}/;
const HTTP_429_RE = /429/;
const NETWORK_ERROR_RE =
	/ECONNRESET|ETIMEDOUT|ENOTFOUND|socket hang up|network/i;
const URL_SPLIT_RE = /[\n,]+/;

/**
 * Checks whether an error is a retryable HTTP error (5xx, 429, or network failure).
 */
function isRetryableError(error: unknown): boolean {
	if (!(error instanceof Error)) {
		return false;
	}
	const msg = error.message;
	return (
		HTTP_5XX_RE.test(msg) || HTTP_429_RE.test(msg) || NETWORK_ERROR_RE.test(msg)
	);
}

/**
 * Make an HTTP request with automatic retry on transient failures.
 */
async function httpWithRetry(
	ctx: IExecuteFunctions,
	options: IHttpRequestOptions
): Promise<IDataObject> {
	let retries = 0;
	while (true) {
		try {
			return (await ctx.helpers.httpRequestWithAuthentication.call(
				ctx,
				"weldApi",
				options
			)) as IDataObject;
		} catch (error) {
			if (retries < MAX_POLL_RETRIES && isRetryableError(error)) {
				retries++;
				const backoff = 1000 * 2 ** retries;
				await new Promise((resolve) => setTimeout(resolve, backoff));
				continue;
			}
			throw error;
		}
	}
}

export class Weld implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Weld",
		name: "weld",
		icon: {
			light: "file:weld.svg",
			dark: "file:weld.dark.svg",
		},
		group: ["input"],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			"Deprecated — use the platform-specific Weld nodes instead (e.g. Weld LinkedIn Profiles, Weld Instagram Posts)",
		defaults: { name: "Weld" },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: "weldApi",
				required: true,
			},
		],
		properties: [
			// Resource
			{
				displayName: "Resource",
				name: "resource",
				type: "options",
				noDataExpression: true,
				options: [
					{ name: "Scrape Job", value: "scrapeJob" },
					{ name: "Credits", value: "credits" },
				],
				default: "scrapeJob",
			},

			// =================================================================
			// Scrape Job Operations
			// =================================================================
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: { show: { resource: ["scrapeJob"] } },
				options: [
					{
						name: "Create",
						value: "create",
						action: "Create a scrape job",
						description: "Start a new scrape job",
					},
					{
						name: "Cancel",
						value: "cancel",
						action: "Cancel a scrape job",
						description:
							"Cancel a pending or processing job and refund credits",
					},
					{
						name: "Get",
						value: "get",
						action: "Get a scrape job",
						description: "Get job status and details",
					},
					{
						name: "Get Results",
						value: "getResults",
						action: "Get scrape results",
						description: "Get results from a completed job",
					},
					{
						name: "List",
						value: "list",
						action: "List scrape jobs",
						description: "List recent scrape jobs",
					},
				],
				default: "create",
			},

			// -- Create fields --
			{
				displayName: "Scraper",
				name: "scraperId",
				type: "options",
				options: SCRAPER_OPTIONS,
				default: "linkedin-profiles",
				required: true,
				displayOptions: {
					show: { resource: ["scrapeJob"], operation: ["create"] },
				},
				description: "Which scraper to use",
			},
			{
				displayName: "URLs",
				name: "urls",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: { resource: ["scrapeJob"], operation: ["create"] },
				},
				description: "URLs to scrape — one per line, or a comma-separated list",
				typeOptions: { rows: 4 },
			},
			{
				displayName: "Job Name",
				name: "jobName",
				type: "string",
				default: "",
				displayOptions: {
					show: { resource: ["scrapeJob"], operation: ["create"] },
				},
				description: "Optional name for this job",
			},
			{
				displayName: "Wait for Completion",
				name: "waitForCompletion",
				type: "boolean",
				default: false,
				displayOptions: {
					show: { resource: ["scrapeJob"], operation: ["create"] },
				},
				description:
					"Whether to wait for the job to finish and return results automatically. WARNING: This holds an n8n worker for the duration of polling — prefer using a separate Get/Get Results node on a schedule for long-running jobs.",
			},
			{
				displayName: "Polling Interval (Seconds)",
				name: "pollInterval",
				type: "number",
				default: 10,
				displayOptions: {
					show: {
						resource: ["scrapeJob"],
						operation: ["create"],
						waitForCompletion: [true],
					},
				},
				description: "How often to check if the job is done",
			},
			{
				displayName: "Max Wait Time (Seconds)",
				name: "maxWait",
				type: "number",
				default: 300,
				displayOptions: {
					show: {
						resource: ["scrapeJob"],
						operation: ["create"],
						waitForCompletion: [true],
					},
				},
				description: "Maximum time to wait before timing out",
			},
			{
				displayName: "Result Limit",
				name: "resultLimit",
				type: "number",
				default: 1000,
				displayOptions: {
					show: {
						resource: ["scrapeJob"],
						operation: ["create"],
						waitForCompletion: [true],
					},
				},
				description:
					"Maximum number of results to fetch after job completion. Increase if your job may return more than 1000 records.",
			},

			// -- Get / Cancel fields --
			{
				displayName: "Job ID",
				name: "jobId",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: ["scrapeJob"],
						operation: ["get", "getResults", "cancel"],
					},
				},
				description: "The ID of the scrape job",
			},

			// -- List fields --
			{
				displayName: "Status Filter",
				name: "statusFilter",
				type: "options",
				options: [
					{ name: "All", value: "" },
					{ name: "Pending", value: "pending" },
					{ name: "Processing", value: "processing" },
					{ name: "Completed", value: "completed" },
					{ name: "Failed", value: "failed" },
				],
				default: "",
				displayOptions: {
					show: { resource: ["scrapeJob"], operation: ["list"] },
				},
				description: "Filter jobs by status",
			},
			{
				displayName: "Return All",
				name: "returnAll",
				type: "boolean",
				default: false,
				displayOptions: {
					show: {
						resource: ["scrapeJob"],
						operation: ["list", "getResults"],
					},
				},
				description:
					"Whether to return all results or only up to a given limit",
			},
			{
				displayName: "Limit",
				name: "limit",
				type: "number",
				default: 50,
				displayOptions: {
					show: {
						resource: ["scrapeJob"],
						operation: ["list", "getResults"],
						returnAll: [false],
					},
				},
				description: "Max number of results to return",
				typeOptions: { minValue: 1 },
			},

			// =================================================================
			// Credits Operations
			// =================================================================
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: { show: { resource: ["credits"] } },
				options: [
					{
						name: "Get Balance",
						value: "getBalance",
						action: "Get credit balance",
						description: "Get current credit balance",
					},
					{
						name: "Get Transactions",
						value: "getTransactions",
						action: "Get credit transactions",
						description: "Get credit transaction history",
					},
				],
				default: "getBalance",
			},
			{
				displayName: "Limit",
				name: "transactionLimit",
				type: "number",
				default: 50,
				displayOptions: {
					show: { resource: ["credits"], operation: ["getTransactions"] },
				},
				description: "Maximum number of transactions to return",
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		await this.getCredentials("weldApi");
		const baseUrl = BASE_URL;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter("resource", i) as string;
				const operation = this.getNodeParameter("operation", i) as string;
				const key = `${resource}.${operation}`;
				const results = await executeOperation.call(this, key, i, baseUrl);
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
}

/**
 * Dispatches a single operation and returns one or more output items.
 */
async function executeOperation(
	this: IExecuteFunctions,
	key: string,
	i: number,
	baseUrl: string
): Promise<INodeExecutionData[]> {
	switch (key) {
		case "scrapeJob.create": {
			const result = await createJob.call(this, i, baseUrl);
			return Array.isArray(result) ? result : [result];
		}
		case "scrapeJob.cancel": {
			const jobId = this.getNodeParameter("jobId", i) as string;
			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				"weldApi",
				{
					method: "POST",
					url: `${baseUrl}/api/jobs/cancel`,
					body: { jobId },
					json: true,
				}
			);
			return [{ json: response }];
		}
		case "scrapeJob.get": {
			const jobId = this.getNodeParameter("jobId", i) as string;
			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				"weldApi",
				{
					method: "GET",
					url: `${baseUrl}/api/jobs/get?jobId=${encodeURIComponent(jobId)}`,
					json: true,
				}
			);
			return [{ json: response.job ?? response }];
		}
		case "scrapeJob.getResults": {
			const jobId = this.getNodeParameter("jobId", i) as string;
			const returnAll = this.getNodeParameter("returnAll", i, false) as boolean;
			const limit = returnAll
				? 10_000
				: (this.getNodeParameter("limit", i, 50) as number);
			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				"weldApi",
				{
					method: "GET",
					url: `${baseUrl}/api/jobs/results?jobId=${encodeURIComponent(jobId)}&limit=${limit}`,
					json: true,
				}
			);
			const results = response.results ?? [];
			return (results as Array<{ data?: IDataObject }>).map((r) => ({
				json: (r.data ?? r) as IDataObject,
			}));
		}
		case "scrapeJob.list": {
			const statusFilter = this.getNodeParameter(
				"statusFilter",
				i,
				""
			) as string;
			const returnAll = this.getNodeParameter("returnAll", i, false) as boolean;
			const limit = returnAll
				? 10_000
				: (this.getNodeParameter("limit", i, 50) as number);
			let url = `${baseUrl}/api/jobs?limit=${limit}`;
			if (statusFilter) {
				url += `&status=${encodeURIComponent(statusFilter)}`;
			}
			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				"weldApi",
				{
					method: "GET",
					url,
					json: true,
				}
			);
			const jobs = response.jobs ?? [];
			return (jobs as IDataObject[]).map((job) => ({
				json: job,
			}));
		}
		case "credits.getBalance": {
			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				"weldApi",
				{
					method: "GET",
					url: `${baseUrl}/api/credits/balance`,
					json: true,
				}
			);
			return [{ json: response }];
		}
		case "credits.getTransactions": {
			const limit = this.getNodeParameter("transactionLimit", i, 50) as number;
			const response = await this.helpers.httpRequestWithAuthentication.call(
				this,
				"weldApi",
				{
					method: "GET",
					url: `${baseUrl}/api/credits/transactions?limit=${limit}`,
					json: true,
				}
			);
			const txns = response.transactions ?? [];
			return (txns as IDataObject[]).map((txn) => ({
				json: txn,
			}));
		}
		default:
			return [];
	}
}

/**
 * Create a scrape job. Optionally polls until completion and returns results.
 */
async function createJob(
	this: IExecuteFunctions,
	itemIndex: number,
	baseUrl: string
): Promise<INodeExecutionData | INodeExecutionData[]> {
	const scraperId = this.getNodeParameter("scraperId", itemIndex) as string;
	const urlsRaw = this.getNodeParameter("urls", itemIndex) as string;
	const jobName = this.getNodeParameter("jobName", itemIndex, "") as string;
	const waitForCompletion = this.getNodeParameter(
		"waitForCompletion",
		itemIndex,
		false
	) as boolean;

	// Parse URLs: split by newlines and commas, trim, filter empty
	const urls = urlsRaw
		.split(URL_SPLIT_RE)
		.map((u) => u.trim())
		.filter((u) => u.length > 0);

	if (urls.length === 0) {
		throw new NodeOperationError(this.getNode(), "No URLs provided", {
			itemIndex,
		});
	}

	const inputs = urls.map((url) => ({ url }));

	// Create the job
	const createResponse = await this.helpers.httpRequestWithAuthentication.call(
		this,
		"weldApi",
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

	return pollForResults.call(this, itemIndex, baseUrl, jobId, scraperId);
}

/**
 * Poll a job until completion and return its results.
 */
async function pollForResults(
	this: IExecuteFunctions,
	itemIndex: number,
	baseUrl: string,
	jobId: string,
	scraperId: string
): Promise<INodeExecutionData | INodeExecutionData[]> {
	const pollInterval = this.getNodeParameter(
		"pollInterval",
		itemIndex,
		10
	) as number;
	const maxWait = this.getNodeParameter("maxWait", itemIndex, 300) as number;
	const resultLimit = this.getNodeParameter(
		"resultLimit",
		itemIndex,
		1000
	) as number;
	const startTime = Date.now();

	while (true) {
		const elapsed = (Date.now() - startTime) / 1000;
		if (elapsed >= maxWait) {
			return {
				json: {
					jobId,
					status: "timeout",
					message: `Job did not complete within ${maxWait}s. Use "Get" or "Get Results" to check later.`,
				},
			};
		}

		await new Promise((resolve) => setTimeout(resolve, pollInterval * 1000));

		const jobResponse = await httpWithRetry(this, {
			method: "GET",
			url: `${baseUrl}/api/jobs/get?jobId=${encodeURIComponent(jobId)}`,
			json: true,
		});

		const job = (jobResponse.job ?? jobResponse) as IDataObject;
		const status = job.status as string;

		if (status === "completed" || status === "partial") {
			return fetchCompletedResults.call(
				this,
				baseUrl,
				jobId,
				scraperId,
				resultLimit,
				job
			);
		}

		if (status === "failed") {
			throw new NodeOperationError(
				this.getNode(),
				`Scrape job failed: ${job.errorMessage || "Unknown error"}`,
				{ itemIndex }
			);
		}
	}
}

/**
 * Fetch results for a completed job and format them as n8n output items.
 */
async function fetchCompletedResults(
	this: IExecuteFunctions,
	baseUrl: string,
	jobId: string,
	scraperId: string,
	resultLimit: number,
	job: IDataObject
): Promise<INodeExecutionData | INodeExecutionData[]> {
	const resultsResponse = await this.helpers.httpRequestWithAuthentication.call(
		this,
		"weldApi",
		{
			method: "GET",
			url: `${baseUrl}/api/jobs/results?jobId=${encodeURIComponent(jobId)}&limit=${resultLimit}`,
			json: true,
		}
	);

	const results = resultsResponse.results ?? [];
	if (results.length === 0) {
		return { json: { ...job, results: [] } };
	}

	return results.map((r: { data?: unknown }) => ({
		json: {
			_jobId: jobId,
			_scraperId: scraperId,
			...(r.data && typeof r.data === "object"
				? (r.data as IDataObject)
				: { data: r.data }),
		} as IDataObject,
	}));
}
