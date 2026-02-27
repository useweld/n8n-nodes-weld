import { describe, expect, it } from "vitest";
import { Weld } from "../../nodes/Weld/Weld.node";
import { mockCreditBalance, mockTransactions } from "../mocks/mockData";
import { createMockExecuteFunctions } from "../mocks/mockExecuteFunctions";

const node = new Weld();

describe("credits getBalance operation", () => {
	it("should return the full balance response", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "credits",
				operation: "getBalance",
			},
			httpHandler: () => mockCreditBalance,
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(1);
		expect(result[0][0].json).toEqual(mockCreditBalance);
	});

	it("should call the correct balance endpoint", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "credits",
				operation: "getBalance",
			},
			httpHandler: () => mockCreditBalance,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string; method: string };
		expect(request.method).toBe("GET");
		expect(request.url).toContain("/api/credits/balance");
	});
});

describe("credits getTransactions operation", () => {
	it("should return each transaction as a separate item", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "credits",
				operation: "getTransactions",
				transactionLimit: 50,
			},
			httpHandler: () => mockTransactions,
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(3);
		expect(result[0][0].json).toEqual(mockTransactions.transactions[0]);
		expect(result[0][1].json).toEqual(mockTransactions.transactions[1]);
		expect(result[0][2].json).toEqual(mockTransactions.transactions[2]);
	});

	it("should pass the transactionLimit to the URL", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "credits",
				operation: "getTransactions",
				transactionLimit: 25,
			},
			httpHandler: () => mockTransactions,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string };
		expect(request.url).toContain("limit=25");
	});

	it("should return empty array when no transactions exist", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "credits",
				operation: "getTransactions",
				transactionLimit: 50,
			},
			httpHandler: () => ({ transactions: [] }),
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(0);
	});

	it("should use default transactionLimit of 50", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "credits",
				operation: "getTransactions",
			},
			httpHandler: () => mockTransactions,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as { url: string };
		expect(request.url).toContain("limit=50");
	});
});
