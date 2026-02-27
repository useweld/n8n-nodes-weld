import { describe, expect, it } from "vitest";
import { Weld } from "../../nodes/Weld/Weld.node";
import { mockJobsList } from "../mocks/mockData";
import { createMockExecuteFunctions } from "../mocks/mockExecuteFunctions";

const node = new Weld();

describe("scrapeJob list operation", () => {
	it("should return each job as a separate item with pairedItem", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "list",
				statusFilter: "",
				returnAll: false,
				limit: 50,
			},
			httpHandler: () => mockJobsList,
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(3);
		expect(result[0][0].json).toEqual(mockJobsList.jobs[0]);
		expect(result[0][0].pairedItem).toEqual({ item: 0 });
		expect(result[0][1].json).toEqual(mockJobsList.jobs[1]);
		expect(result[0][2].json).toEqual(mockJobsList.jobs[2]);
	});

	it("should append status filter to URL when provided", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "list",
				statusFilter: "completed",
				returnAll: false,
				limit: 50,
			},
			httpHandler: () => mockJobsList,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string };
		expect(request.url).toContain("status=completed");
	});

	it("should not append status filter when empty", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "list",
				statusFilter: "",
				returnAll: false,
				limit: 50,
			},
			httpHandler: () => mockJobsList,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string };
		expect(request.url).not.toContain("status=");
	});

	it("should respect limit parameter", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "list",
				statusFilter: "",
				returnAll: false,
				limit: 10,
			},
			httpHandler: () => mockJobsList,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string };
		expect(request.url).toContain("limit=10");
	});

	it("should return empty array when no jobs exist", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "list",
				statusFilter: "",
				returnAll: false,
				limit: 50,
			},
			httpHandler: () => ({ jobs: [] }),
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(0);
	});

	it("should URL-encode the status filter value", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "list",
				statusFilter: "pending",
				returnAll: false,
				limit: 50,
			},
			httpHandler: () => mockJobsList,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string };
		expect(request.url).toContain("status=pending");
	});

	it("should fetch all jobs when returnAll is true", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "list",
				statusFilter: "",
				returnAll: true,
			},
			httpHandler: () => mockJobsList,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string };
		expect(request.url).toContain("limit=10000");
	});
});
