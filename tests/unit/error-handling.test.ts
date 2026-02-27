import { NodeOperationError } from "n8n-workflow";
import { describe, expect, it } from "vitest";
import { Weld } from "../../nodes/Weld/Weld.node";
import { createMockExecuteFunctions } from "../mocks/mockExecuteFunctions";

const node = new Weld();

describe("error handling", () => {
	it("should throw NodeOperationError when continueOnFail is false", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "get",
				jobId: "job_123",
			},
			continueOnFail: false,
			httpHandler: () => {
				throw new Error("API connection refused");
			},
		});

		await expect(node.execute.call(mock)).rejects.toThrow(NodeOperationError);
	});

	it("should return error item when continueOnFail is true", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "get",
				jobId: "job_123",
			},
			continueOnFail: true,
			httpHandler: () => {
				throw new Error("API connection refused");
			},
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(1);
		expect(result[0][0].json).toEqual({
			error: "API connection refused",
		});
		expect(result[0][0].pairedItem).toEqual({ item: 0 });
	});

	it("should handle non-Error thrown values with continueOnFail", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "get",
				jobId: "job_123",
			},
			continueOnFail: true,
			httpHandler: () => {
				throw "string error";
			},
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(1);
		expect(result[0][0].json).toEqual({
			error: "Unknown error",
		});
	});

	it("should process multiple items and continue after errors", async () => {
		let callCount = 0;
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "credits",
				operation: "getBalance",
			},
			inputData: [{ json: {} }, { json: {} }, { json: {} }],
			continueOnFail: true,
			httpHandler: () => {
				callCount++;
				if (callCount === 2) {
					throw new Error("Transient failure");
				}
				return { balance: 5000 };
			},
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(3);
		expect(result[0][0].json).toEqual({ balance: 5000 });
		expect(result[0][1].json).toEqual({ error: "Transient failure" });
		expect(result[0][2].json).toEqual({ balance: 5000 });
	});
});
