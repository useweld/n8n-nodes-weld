import { describe, expect, it } from "vitest";
import { WeldJobs } from "../../nodes/WeldJobs/WeldJobs.node";
import { mockJobCompleted } from "../mocks/mockData";
import { createMockExecuteFunctions } from "../mocks/mockExecuteFunctions";

const node = new WeldJobs();

describe("scrapeJob get operation", () => {
	it("should call the correct URL with encoded jobId", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "job",
				operation: "get",
				jobId: "job_abc123",
			},
			httpHandler: () => mockJobCompleted,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string; method: string };
		expect(request.method).toBe("GET");
		expect(request.url).toContain("/api/jobs/get?jobId=job_abc123");
	});

	it("should return the job object from response.job", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "job",
				operation: "get",
				jobId: "job_abc123",
			},
			httpHandler: () => mockJobCompleted,
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(1);
		expect(result[0][0].json).toEqual(mockJobCompleted.job);
	});

	it("should fallback to full response when .job is missing", async () => {
		const directResponse = { _id: "job_xyz", status: "completed" };
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "job",
				operation: "get",
				jobId: "job_xyz",
			},
			httpHandler: () => directResponse,
		});

		const result = await node.execute.call(mock);

		expect(result[0][0].json).toEqual(directResponse);
	});

	it("should URL-encode special characters in jobId", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "job",
				operation: "get",
				jobId: "job/with spaces&chars",
			},
			httpHandler: () => mockJobCompleted,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string };
		expect(request.url).toContain(encodeURIComponent("job/with spaces&chars"));
	});
});
