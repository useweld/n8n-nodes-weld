import { NodeOperationError } from "n8n-workflow";
import { describe, expect, it } from "vitest";
import { Weld } from "../../nodes/Weld/Weld.node";
import { mockCreateJobResponse } from "../mocks/mockData";
import { createMockExecuteFunctions } from "../mocks/mockExecuteFunctions";

const node = new Weld();

function createJobMock(urls: string) {
	return createMockExecuteFunctions({
		nodeParameters: {
			resource: "scrapeJob",
			operation: "create",
			scraperId: "linkedin-profiles",
			urls,
			jobName: "",
			waitForCompletion: false,
		},
		httpHandler: () => mockCreateJobResponse,
	});
}

describe("URL parsing", () => {
	it("should parse newline-separated URLs", async () => {
		const mock = createJobMock(
			"https://linkedin.com/in/alice\nhttps://linkedin.com/in/bob"
		);

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const body = (call[1] as { body: { inputs: { url: string }[] } }).body;
		expect(body.inputs).toEqual([
			{ url: "https://linkedin.com/in/alice" },
			{ url: "https://linkedin.com/in/bob" },
		]);
	});

	it("should parse comma-separated URLs", async () => {
		const mock = createJobMock(
			"https://linkedin.com/in/alice,https://linkedin.com/in/bob"
		);

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const body = (call[1] as { body: { inputs: { url: string }[] } }).body;
		expect(body.inputs).toEqual([
			{ url: "https://linkedin.com/in/alice" },
			{ url: "https://linkedin.com/in/bob" },
		]);
	});

	it("should parse mixed newline and comma URLs", async () => {
		const mock = createJobMock(
			"https://a.com\nhttps://b.com,https://c.com\nhttps://d.com"
		);

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const body = (call[1] as { body: { inputs: { url: string }[] } }).body;
		expect(body.inputs).toHaveLength(4);
	});

	it("should trim whitespace from URLs", async () => {
		const mock = createJobMock(
			"  https://linkedin.com/in/alice  \n  https://linkedin.com/in/bob  "
		);

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const body = (call[1] as { body: { inputs: { url: string }[] } }).body;
		expect(body.inputs).toEqual([
			{ url: "https://linkedin.com/in/alice" },
			{ url: "https://linkedin.com/in/bob" },
		]);
	});

	it("should filter out empty lines", async () => {
		const mock = createJobMock(
			"https://linkedin.com/in/alice\n\n\nhttps://linkedin.com/in/bob\n"
		);

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const body = (call[1] as { body: { inputs: { url: string }[] } }).body;
		expect(body.inputs).toHaveLength(2);
	});

	it("should throw NodeOperationError when no URLs provided", async () => {
		const mock = createJobMock("");

		await expect(node.execute.call(mock)).rejects.toThrow(NodeOperationError);
	});

	it("should throw NodeOperationError for whitespace-only input", async () => {
		const mock = createJobMock("   \n  \n  ");

		await expect(node.execute.call(mock)).rejects.toThrow(NodeOperationError);
	});

	it("should handle a single URL", async () => {
		const mock = createJobMock("https://linkedin.com/in/alice");

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const body = (call[1] as { body: { inputs: { url: string }[] } }).body;
		expect(body.inputs).toEqual([{ url: "https://linkedin.com/in/alice" }]);
	});
});
