import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from "n8n-workflow";
import { NodeConnectionTypes, NodeOperationError } from "n8n-workflow";
import { BASE_URL, httpWithRetry } from "../shared/api";

export class ScraperNodeJobs implements INodeType {
	description: INodeTypeDescription = {
		displayName: "ScraperNode Jobs",
		name: "scraperNodeJobs",
		icon: {
			light: "file:scrapernode.svg",
			dark: "file:scrapernode.dark.svg",
		},
		group: ["input"],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			"Manage ScraperNode scrape jobs and credits — list, cancel, check status, and view balance",
		defaults: { name: "ScraperNode Jobs" },
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [{ name: "scraperNodeApi", required: true }],
		properties: [
			// Resource
			{
				displayName: "Resource",
				name: "resource",
				type: "options",
				noDataExpression: true,
				options: [
					{ name: "Job", value: "job" },
					{ name: 'Credit', value: "credits" },
				],
				default: "job",
			},

			// ===============================================================
			// Job operations
			// ===============================================================
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: { show: { resource: ["job"] } },
				options: [
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
					{
						name: "List",
						value: "list",
						action: "List scrape jobs",
						description: "List recent scrape jobs",
					},
					{
						name: "Cancel",
						value: "cancel",
						action: "Cancel a scrape job",
						description:
							"Cancel a pending or processing job and refund credits",
					},
				],
				default: "list",
			},

			// -- Job ID field (Get, Get Results, Cancel) --
			{
				displayName: "Job ID",
				name: "jobId",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						resource: ["job"],
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
					{ name: "Completed", value: "completed" },
					{ name: "Failed", value: "failed" },
					{ name: "Pending", value: "pending" },
					{ name: "Processing", value: "processing" },
				],
				default: "",
				displayOptions: {
					show: { resource: ["job"], operation: ["list"] },
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
						resource: ["job"],
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
						resource: ["job"],
						operation: ["list", "getResults"],
						returnAll: [false],
					},
				},
				description: "Max number of results to return",
				typeOptions: { minValue: 1 },
			},

			// ===============================================================
			// Credits operations
			// ===============================================================
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
					show: {
						resource: ["credits"],
						operation: ["getTransactions"],
					},
				},
				description: "Maximum number of transactions to return",
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		await this.getCredentials("scraperNodeApi");
		const baseUrl = BASE_URL;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter("resource", i) as string;
				const operation = this.getNodeParameter("operation", i) as string;
				const key = `${resource}.${operation}`;
				const results = await executeJobsOperation.call(this, key, i, baseUrl);
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

async function executeJobsOperation(
	this: IExecuteFunctions,
	key: string,
	i: number,
	baseUrl: string
): Promise<INodeExecutionData[]> {
	switch (key) {
		case "job.get": {
			const jobId = this.getNodeParameter("jobId", i) as string;
			const response = await httpWithRetry(this, {
				method: "GET",
				url: `${baseUrl}/api/jobs/get?jobId=${encodeURIComponent(jobId)}`,
				json: true,
			});
			return [{ json: (response.job ?? response) as IDataObject }];
		}
		case "job.getResults": {
			const jobId = this.getNodeParameter("jobId", i) as string;
			const returnAll = this.getNodeParameter("returnAll", i, false) as boolean;
			const limit = returnAll
				? 10_000
				: (this.getNodeParameter("limit", i, 50) as number);
			const response = await httpWithRetry(this, {
				method: "GET",
				url: `${baseUrl}/api/jobs/results?jobId=${encodeURIComponent(jobId)}&limit=${limit}`,
				json: true,
			});
			const results = (response.results ?? []) as Array<{ data?: IDataObject }>;
			return results.map((r) => ({
				json: (r.data ?? r) as IDataObject,
			}));
		}
		case "job.list": {
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
			const response = await httpWithRetry(this, {
				method: "GET",
				url,
				json: true,
			});
			const jobs = (response.jobs ?? []) as IDataObject[];
			return jobs.map((job) => ({ json: job }));
		}
		case "job.cancel": {
			const jobId = this.getNodeParameter("jobId", i) as string;
			const response = await httpWithRetry(this, {
				method: "POST",
				url: `${baseUrl}/api/jobs/cancel`,
				body: { jobId },
				json: true,
			});
			return [{ json: response }];
		}
		case "credits.getBalance": {
			const response = await httpWithRetry(this, {
				method: "GET",
				url: `${baseUrl}/api/credits/balance`,
				json: true,
			});
			return [{ json: response }];
		}
		case "credits.getTransactions": {
			const limit = this.getNodeParameter("transactionLimit", i, 50) as number;
			const response = await httpWithRetry(this, {
				method: "GET",
				url: `${baseUrl}/api/credits/transactions?limit=${limit}`,
				json: true,
			});
			const txns = (response.transactions ?? []) as IDataObject[];
			return txns.map((txn) => ({ json: txn }));
		}
		default:
			return [];
	}
}
