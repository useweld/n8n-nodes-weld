import { describe, expect, it } from "vitest";
import { WeldJobs } from "../../nodes/WeldJobs/WeldJobs.node";
import {
	mockCreditBalance,
	mockJobsList,
	mockResults,
	mockTransactions,
} from "../mocks/mockData";
import { createMockExecuteFunctions } from "../mocks/mockExecuteFunctions";

const node = new WeldJobs();

describe("WeldJobs node", () => {
	it("should have usableAsTool enabled", () => {
		expect(node.description.usableAsTool).toBe(true);
	});

	describe("job.list", () => {
		it("should list jobs", async () => {
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					resource: "job",
					operation: "list",
					statusFilter: "",
					returnAll: false,
					limit: 50,
				},
				httpHandler: () => mockJobsList,
			});

			const result = await node.execute.call(mock);

			expect(result[0]).toHaveLength(3);
			expect(result[0][0].json).toMatchObject({ _id: "job_1" });
		});

		it("should pass status filter", async () => {
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					resource: "job",
					operation: "list",
					statusFilter: "completed",
					returnAll: false,
					limit: 50,
				},
				httpHandler: () => mockJobsList,
			});

			await node.execute.call(mock);

			const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
			const url = (call[1] as { url: string }).url;
			expect(url).toContain("status=completed");
		});
	});

	describe("job.get", () => {
		it("should get job by ID", async () => {
			const mockJob = {
				job: { _id: "j1", status: "completed" },
			};
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					resource: "job",
					operation: "get",
					jobId: "j1",
				},
				httpHandler: () => mockJob,
			});

			const result = await node.execute.call(mock);

			expect(result[0][0].json).toEqual({ _id: "j1", status: "completed" });
		});
	});

	describe("job.getResults", () => {
		it("should get results with limit", async () => {
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					resource: "job",
					operation: "getResults",
					jobId: "j1",
					returnAll: false,
					limit: 10,
				},
				httpHandler: () => mockResults,
			});

			const result = await node.execute.call(mock);

			expect(result[0]).toHaveLength(2);
			const url = (
				mock.helpers.httpRequestWithAuthentication.mock.calls[0][1] as {
					url: string;
				}
			).url;
			expect(url).toContain("limit=10");
		});
	});

	describe("job.cancel", () => {
		it("should POST to cancel endpoint", async () => {
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					resource: "job",
					operation: "cancel",
					jobId: "j1",
				},
				httpHandler: () => ({ success: true }),
			});

			const result = await node.execute.call(mock);

			const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
			const request = call[1] as {
				method: string;
				url: string;
				body: { jobId: string };
			};
			expect(request.method).toBe("POST");
			expect(request.url).toContain("/api/jobs/cancel");
			expect(request.body.jobId).toBe("j1");
			expect(result[0][0].json).toEqual({ success: true });
		});
	});

	describe("credits.getBalance", () => {
		it("should get credit balance", async () => {
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					resource: "credits",
					operation: "getBalance",
				},
				httpHandler: () => mockCreditBalance,
			});

			const result = await node.execute.call(mock);

			expect(result[0][0].json).toEqual(mockCreditBalance);
		});
	});

	describe("credits.getTransactions", () => {
		it("should get transactions with limit", async () => {
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					resource: "credits",
					operation: "getTransactions",
					transactionLimit: 25,
				},
				httpHandler: () => mockTransactions,
			});

			const result = await node.execute.call(mock);

			expect(result[0]).toHaveLength(3);
			const url = (
				mock.helpers.httpRequestWithAuthentication.mock.calls[0][1] as {
					url: string;
				}
			).url;
			expect(url).toContain("limit=25");
		});
	});
});
