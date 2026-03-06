import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
} from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";
import { httpWithRetry } from "./api";

export async function pollForResults(
	ctx: IExecuteFunctions,
	itemIndex: number,
	baseUrl: string,
	jobId: string,
	scraperId: string
): Promise<INodeExecutionData | INodeExecutionData[]> {
	const pollInterval = ctx.getNodeParameter(
		"pollInterval",
		itemIndex,
		10
	) as number;
	const maxWait = ctx.getNodeParameter("maxWait", itemIndex, 300) as number;
	const resultLimit = ctx.getNodeParameter(
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

		const jobResponse = await httpWithRetry(ctx, {
			method: "GET",
			url: `${baseUrl}/api/jobs/get?jobId=${encodeURIComponent(jobId)}`,
			json: true,
		});

		const job = (jobResponse.job ?? jobResponse) as IDataObject;
		const status = job.status as string;

		if (status === "completed" || status === "partial") {
			return fetchCompletedResults(
				ctx,
				baseUrl,
				jobId,
				scraperId,
				resultLimit,
				job
			);
		}

		if (status === "failed") {
			throw new NodeOperationError(
				ctx.getNode(),
				`Scrape job failed: ${job.errorMessage || "Unknown error"}`,
				{ itemIndex }
			);
		}
	}
}

async function fetchCompletedResults(
	ctx: IExecuteFunctions,
	baseUrl: string,
	jobId: string,
	scraperId: string,
	resultLimit: number,
	job: IDataObject
): Promise<INodeExecutionData | INodeExecutionData[]> {
	const resultsResponse = await httpWithRetry(ctx, {
		method: "GET",
		url: `${baseUrl}/api/jobs/results?jobId=${encodeURIComponent(jobId)}&limit=${resultLimit}`,
		json: true,
	});

	const results = (resultsResponse.results ?? []) as Array<{ data?: unknown }>;
	if (results.length === 0) {
		return { json: { ...job, results: [] } };
	}

	return results.map((r) => ({
		json: {
			_jobId: jobId,
			_scraperId: scraperId,
			...(r.data && typeof r.data === "object"
				? (r.data as IDataObject)
				: { data: r.data }),
		} as IDataObject,
	}));
}
