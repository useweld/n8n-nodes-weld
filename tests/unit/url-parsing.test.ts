import type { INodeType } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";
import { describe, expect, it } from "vitest";
import { WeldLinkedInProfiles } from "../../nodes/WeldLinkedInProfiles/WeldLinkedInProfiles.node";
import { mockCreateJobResponse } from "../mocks/mockData";
import {
	createMockExecuteFunctions,
	type MockedExecuteFunctions,
} from "../mocks/mockExecuteFunctions";

const node: INodeType = new WeldLinkedInProfiles();

async function run(mock: MockedExecuteFunctions) {
	return (await node.execute!.call(mock)) as unknown as {
		json: Record<string, unknown>;
		pairedItem?: unknown;
	}[][];
}

function createJobMock(urls: string) {
	return createMockExecuteFunctions({
		nodeParameters: {
			operation: "create",
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

		await run(mock);

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

		await run(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const body = (call[1] as { body: { inputs: { url: string }[] } }).body;
		expect(body.inputs).toEqual([
			{ url: "https://linkedin.com/in/alice" },
			{ url: "https://linkedin.com/in/bob" },
		]);
	});

	it("should parse mixed newline and comma URLs", async () => {
		const mock = createJobMock(
			"https://linkedin.com/in/a\nhttps://linkedin.com/in/b,https://linkedin.com/in/c\nhttps://linkedin.com/in/d"
		);

		await run(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const body = (call[1] as { body: { inputs: { url: string }[] } }).body;
		expect(body.inputs).toHaveLength(4);
	});

	it("should trim whitespace from URLs", async () => {
		const mock = createJobMock(
			"  https://linkedin.com/in/alice  \n  https://linkedin.com/in/bob  "
		);

		await run(mock);

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

		await run(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const body = (call[1] as { body: { inputs: { url: string }[] } }).body;
		expect(body.inputs).toHaveLength(2);
	});

	it("should throw NodeOperationError when no URLs provided", async () => {
		const mock = createJobMock("");

		await expect(run(mock)).rejects.toThrow(NodeOperationError);
	});

	it("should throw NodeOperationError for whitespace-only input", async () => {
		const mock = createJobMock("   \n  \n  ");

		await expect(run(mock)).rejects.toThrow(NodeOperationError);
	});

	it("should handle a single URL", async () => {
		const mock = createJobMock("https://linkedin.com/in/alice");

		await run(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const body = (call[1] as { body: { inputs: { url: string }[] } }).body;
		expect(body.inputs).toEqual([{ url: "https://linkedin.com/in/alice" }]);
	});

	it("should reject URLs from wrong platform", async () => {
		const mock = createJobMock("https://instagram.com/user");

		await expect(run(mock)).rejects.toThrow(NodeOperationError);
	});

	it("should reject URLs without protocol", async () => {
		const mock = createJobMock("linkedin.com/in/alice");

		await expect(run(mock)).rejects.toThrow(NodeOperationError);
	});
});
