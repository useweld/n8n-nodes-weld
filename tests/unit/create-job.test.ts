import { NodeOperationError } from "n8n-workflow";
import { describe, expect, it, vi } from "vitest";
import { Weld } from "../../nodes/Weld/Weld.node";
import {
	mockCreateJobResponse,
	mockJobCompleted,
	mockJobFailed,
	mockJobPending,
	mockJobProcessing,
	mockResults,
} from "../mocks/mockData";
import { createMockExecuteFunctions } from "../mocks/mockExecuteFunctions";

const node = new Weld();

describe("scrapeJob create operation", () => {
	it("should return job ID immediately when waitForCompletion is false", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "create",
				scraperId: "linkedin-profiles",
				urls: "https://linkedin.com/in/test",
				jobName: "My Test Job",
				waitForCompletion: false,
			},
			httpHandler: () => mockCreateJobResponse,
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(1);
		expect(result[0][0].json).toEqual(mockCreateJobResponse);
	});

	it("should send correct POST body to create endpoint", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "create",
				scraperId: "instagram-profiles",
				urls: "https://instagram.com/user1\nhttps://instagram.com/user2",
				jobName: "IG Batch",
				waitForCompletion: false,
			},
			httpHandler: () => mockCreateJobResponse,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as {
			method: string;
			url: string;
			body: {
				scraperId: string;
				name: string;
				mode?: string;
				inputs: { url: string }[];
			};
		};
		expect(request.method).toBe("POST");
		expect(request.url).toContain("/api/jobs/create");
		expect(request.body.scraperId).toBe("instagram-profiles");
		expect(request.body.name).toBe("IG Batch");
		expect(request.body.mode).toBeUndefined();
		expect(request.body.inputs).toEqual([
			{ url: "https://instagram.com/user1" },
			{ url: "https://instagram.com/user2" },
		]);
	});

	it("should omit name when jobName is empty", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "create",
				scraperId: "linkedin-profiles",
				urls: "https://linkedin.com/in/test",
				jobName: "",
				waitForCompletion: false,
			},
			httpHandler: () => mockCreateJobResponse,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const body = (call[1] as { body: { name?: string } }).body;
		expect(body.name).toBeUndefined();
	});

	it("should poll and return results when waitForCompletion is true", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });

		let callCount = 0;
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "create",
				scraperId: "linkedin-profiles",
				urls: "https://linkedin.com/in/test",
				jobName: "",
				waitForCompletion: true,
				pollInterval: 1,
				maxWait: 30,
			},
			httpHandler: (req) => {
				if (req.method === "POST") return mockCreateJobResponse;
				if (req.url.includes("/api/jobs/get")) {
					callCount++;
					if (callCount <= 1) return mockJobProcessing;
					return mockJobCompleted;
				}
				if (req.url.includes("/api/jobs/results")) return mockResults;
				return {};
			},
		});

		const result = await node.execute.call(mock);

		vi.useRealTimers();

		// Should return each result as a separate item with metadata
		expect(result[0].length).toBe(2);
		expect(result[0][0].json).toMatchObject({
			_jobId: "job_abc123",
			_scraperId: "linkedin-profiles",
			name: "Jane Doe",
		});
		expect(result[0][1].json).toMatchObject({
			_jobId: "job_abc123",
			_scraperId: "linkedin-profiles",
			name: "John Smith",
		});
	});

	it("should return timeout status when maxWait is exceeded", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });

		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "create",
				scraperId: "linkedin-profiles",
				urls: "https://linkedin.com/in/test",
				jobName: "",
				waitForCompletion: true,
				pollInterval: 1,
				maxWait: 2,
			},
			httpHandler: (req) => {
				if (req.method === "POST") return mockCreateJobResponse;
				return mockJobPending;
			},
		});

		const result = await node.execute.call(mock);

		vi.useRealTimers();

		expect(result[0]).toHaveLength(1);
		expect(result[0][0].json).toMatchObject({
			jobId: "job_abc123",
			status: "timeout",
		});
		expect(result[0][0].json).toHaveProperty("message");
	});

	it("should throw NodeOperationError when job fails", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });

		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "create",
				scraperId: "linkedin-profiles",
				urls: "https://linkedin.com/in/test",
				jobName: "",
				waitForCompletion: true,
				pollInterval: 1,
				maxWait: 30,
			},
			httpHandler: (req) => {
				if (req.method === "POST") return mockCreateJobResponse;
				if (req.url.includes("/api/jobs/get")) return mockJobFailed;
				return {};
			},
		});

		await expect(node.execute.call(mock)).rejects.toThrow(NodeOperationError);

		vi.useRealTimers();
	});

	it("should return empty results wrapper when completed job has no results", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });

		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "create",
				scraperId: "linkedin-profiles",
				urls: "https://linkedin.com/in/test",
				jobName: "",
				waitForCompletion: true,
				pollInterval: 1,
				maxWait: 30,
			},
			httpHandler: (req) => {
				if (req.method === "POST") return mockCreateJobResponse;
				if (req.url.includes("/api/jobs/get")) return mockJobCompleted;
				if (req.url.includes("/api/jobs/results")) return { results: [] };
				return {};
			},
		});

		const result = await node.execute.call(mock);

		vi.useRealTimers();

		expect(result[0]).toHaveLength(1);
		expect(result[0][0].json).toHaveProperty("results");
		expect((result[0][0].json as { results: unknown[] }).results).toEqual([]);
	});

	it("should use custom resultLimit when fetching results after completion", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });

		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "create",
				scraperId: "linkedin-profiles",
				urls: "https://linkedin.com/in/test",
				jobName: "",
				waitForCompletion: true,
				pollInterval: 1,
				maxWait: 30,
				resultLimit: 5000,
			},
			httpHandler: (req) => {
				if (req.method === "POST") return mockCreateJobResponse;
				if (req.url.includes("/api/jobs/get")) return mockJobCompleted;
				if (req.url.includes("/api/jobs/results")) return mockResults;
				return {};
			},
		});

		await node.execute.call(mock);

		vi.useRealTimers();

		const resultsCalls =
			mock.helpers.httpRequestWithAuthentication.mock.calls.filter((c) =>
				(c[1] as { url: string }).url.includes("/api/jobs/results")
			);
		expect(resultsCalls).toHaveLength(1);
		expect((resultsCalls[0][1] as { url: string }).url).toContain("limit=5000");
	});

	it("should retry on transient 5xx errors during polling", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });

		let pollCount = 0;
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "create",
				scraperId: "linkedin-profiles",
				urls: "https://linkedin.com/in/test",
				jobName: "",
				waitForCompletion: true,
				pollInterval: 1,
				maxWait: 60,
			},
			httpHandler: (req) => {
				if (req.method === "POST") return mockCreateJobResponse;
				if (req.url.includes("/api/jobs/get")) {
					pollCount++;
					if (pollCount === 1) throw new Error("502 Bad Gateway");
					return mockJobCompleted;
				}
				if (req.url.includes("/api/jobs/results")) return mockResults;
				return {};
			},
		});

		const result = await node.execute.call(mock);

		vi.useRealTimers();

		expect(result[0].length).toBe(2);
		expect(pollCount).toBe(2);
	});

	it("should retry on 429 rate-limit errors during polling", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });

		let pollCount = 0;
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "create",
				scraperId: "linkedin-profiles",
				urls: "https://linkedin.com/in/test",
				jobName: "",
				waitForCompletion: true,
				pollInterval: 1,
				maxWait: 60,
			},
			httpHandler: (req) => {
				if (req.method === "POST") return mockCreateJobResponse;
				if (req.url.includes("/api/jobs/get")) {
					pollCount++;
					if (pollCount === 1) throw new Error("429 Too Many Requests");
					return mockJobCompleted;
				}
				if (req.url.includes("/api/jobs/results")) return mockResults;
				return {};
			},
		});

		const result = await node.execute.call(mock);

		vi.useRealTimers();

		expect(result[0].length).toBe(2);
		expect(pollCount).toBe(2);
	});

	it("should throw after exhausting retries on persistent 5xx errors", async () => {
		vi.useFakeTimers({ shouldAdvanceTime: true });

		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "create",
				scraperId: "linkedin-profiles",
				urls: "https://linkedin.com/in/test",
				jobName: "",
				waitForCompletion: true,
				pollInterval: 1,
				maxWait: 60,
			},
			httpHandler: (req) => {
				if (req.method === "POST") return mockCreateJobResponse;
				if (req.url.includes("/api/jobs/get"))
					throw new Error("503 Service Unavailable");
				return {};
			},
		});

		await expect(node.execute.call(mock)).rejects.toThrow(
			"503 Service Unavailable"
		);

		vi.useRealTimers();
	}, 30_000);
});
