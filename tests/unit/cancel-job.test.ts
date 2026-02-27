import { describe, expect, it } from "vitest";
import { Weld } from "../../nodes/Weld/Weld.node";
import { createMockExecuteFunctions } from "../mocks/mockExecuteFunctions";

const node = new Weld();

const mockCancelResponse = {
	jobId: "job_abc123",
	status: "cancelled",
	creditsRefunded: 50,
};

describe("scrapeJob cancel operation", () => {
	it("should send POST to cancel endpoint with jobId", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "cancel",
				jobId: "job_abc123",
			},
			httpHandler: () => mockCancelResponse,
		});

		await node.execute.call(mock);

		const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
		const request = call[1] as {
			method: string;
			url: string;
			body: { jobId: string };
		};
		expect(request.method).toBe("POST");
		expect(request.url).toContain("/api/jobs/cancel");
		expect(request.body.jobId).toBe("job_abc123");
	});

	it("should return the cancel response", async () => {
		const mock = createMockExecuteFunctions({
			nodeParameters: {
				resource: "scrapeJob",
				operation: "cancel",
				jobId: "job_abc123",
			},
			httpHandler: () => mockCancelResponse,
		});

		const result = await node.execute.call(mock);

		expect(result[0]).toHaveLength(1);
		expect(result[0][0].json).toEqual(mockCancelResponse);
		expect(result[0][0].pairedItem).toEqual({ item: 0 });
	});
});
