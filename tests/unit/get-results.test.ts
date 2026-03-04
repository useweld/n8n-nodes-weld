import { describe, expect, it } from "vitest";
import { WeldJobs } from "../../nodes/WeldJobs/WeldJobs.node";
import { mockEmptyResults, mockResults } from "../mocks/mockData";
import { createMockExecuteFunctions } from "../mocks/mockExecuteFunctions";

const node = new WeldJobs();

describe("scrapeJob getResults operation", () => {
	it("should call the correct URL with jobId and limit", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "job",
				operation: "getResults",
				jobId: "job_abc123",
				returnAll: false,
				limit: 25,
			},
			httpHandler: () => mockResults,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string; method: string };
		expect(request.method).toBe("GET");
		expect(request.url).toContain("jobId=job_abc123");
		expect(request.url).toContain("limit=25");
	});

	it("should return each result.data as a separate item with pairedItem", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "job",
				operation: "getResults",
				jobId: "job_abc123",
				returnAll: false,
				limit: 100,
			},
			httpHandler: () => mockResults,
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(2);
		expect(result[0][0].json).toEqual(mockResults.results[0].data);
		expect(result[0][0].pairedItem).toEqual({ item: 0 });
		expect(result[0][1].json).toEqual(mockResults.results[1].data);
		expect(result[0][1].pairedItem).toEqual({ item: 0 });
	});

	it("should return empty array for no results", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "job",
				operation: "getResults",
				jobId: "job_abc123",
				returnAll: false,
				limit: 100,
			},
			httpHandler: () => mockEmptyResults,
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(0);
	});

	it("should fallback to full result object when .data is missing", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "job",
				operation: "getResults",
				jobId: "job_abc123",
				returnAll: false,
				limit: 100,
			},
			httpHandler: () => ({
				results: [{ rawField: "value1" }, { rawField: "value2" }],
			}),
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(2);
		expect(result[0][0].json).toEqual({ rawField: "value1" });
	});

	it("should use default limit of 50 when returnAll is false", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "job",
				operation: "getResults",
				jobId: "job_abc123",
				returnAll: false,
			},
			httpHandler: () => mockEmptyResults,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string };
		expect(request.url).toContain("limit=50");
	});

	it("should fetch all results when returnAll is true", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "job",
				operation: "getResults",
				jobId: "job_abc123",
				returnAll: true,
			},
			httpHandler: () => mockResults,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string };
		expect(request.url).toContain("limit=10000");
	});
});
