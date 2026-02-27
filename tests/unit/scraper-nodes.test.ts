import type { INodeType } from "n8n-workflow";
import { NodeOperationError } from "n8n-workflow";
import { describe, expect, it, vi } from "vitest";
import { WeldFacebookGroups } from "../../nodes/WeldFacebookGroups/WeldFacebookGroups.node";
import { WeldFacebookProfiles } from "../../nodes/WeldFacebookProfiles/WeldFacebookProfiles.node";
import { WeldInstagramComments } from "../../nodes/WeldInstagramComments/WeldInstagramComments.node";
import { WeldInstagramPosts } from "../../nodes/WeldInstagramPosts/WeldInstagramPosts.node";
import { WeldInstagramProfiles } from "../../nodes/WeldInstagramProfiles/WeldInstagramProfiles.node";
import { WeldLinkedInCompanies } from "../../nodes/WeldLinkedInCompanies/WeldLinkedInCompanies.node";
import { WeldLinkedInPosts } from "../../nodes/WeldLinkedInPosts/WeldLinkedInPosts.node";
import { WeldLinkedInProfiles } from "../../nodes/WeldLinkedInProfiles/WeldLinkedInProfiles.node";
import { WeldTikTokProfiles } from "../../nodes/WeldTikTokProfiles/WeldTikTokProfiles.node";
import { WeldTikTokVideos } from "../../nodes/WeldTikTokVideos/WeldTikTokVideos.node";
import { WeldTwitterPosts } from "../../nodes/WeldTwitterPosts/WeldTwitterPosts.node";
import { WeldTwitterProfiles } from "../../nodes/WeldTwitterProfiles/WeldTwitterProfiles.node";
import { WeldYouTubeChannels } from "../../nodes/WeldYouTubeChannels/WeldYouTubeChannels.node";
import { WeldYouTubeComments } from "../../nodes/WeldYouTubeComments/WeldYouTubeComments.node";
import {
	mockCreateJobResponse,
	mockJobCompleted,
	mockJobProcessing,
	mockResults,
} from "../mocks/mockData";
import {
	createMockExecuteFunctions,
	type MockedExecuteFunctions,
} from "../mocks/mockExecuteFunctions";

/** Helper to call execute with proper type casts for factory-generated nodes. */
async function exec(node: INodeType, mock: MockedExecuteFunctions) {
	return (await node.execute!.call(mock)) as unknown as {
		json: Record<string, unknown>;
		pairedItem?: unknown;
	}[][];
}

interface ScraperTestCase {
	name: string;
	NodeClass: new () => INodeType;
	scraperId: string;
	sampleUrl: string;
}

const SCRAPERS: ScraperTestCase[] = [
	{
		name: "WeldLinkedInProfiles",
		NodeClass: WeldLinkedInProfiles,
		scraperId: "linkedin-profiles",
		sampleUrl: "https://linkedin.com/in/janedoe",
	},
	{
		name: "WeldLinkedInCompanies",
		NodeClass: WeldLinkedInCompanies,
		scraperId: "linkedin-companies",
		sampleUrl: "https://linkedin.com/company/acme",
	},
	{
		name: "WeldLinkedInPosts",
		NodeClass: WeldLinkedInPosts,
		scraperId: "linkedin-posts",
		sampleUrl: "https://linkedin.com/in/janedoe",
	},
	{
		name: "WeldInstagramProfiles",
		NodeClass: WeldInstagramProfiles,
		scraperId: "instagram-profiles",
		sampleUrl: "https://instagram.com/username",
	},
	{
		name: "WeldInstagramPosts",
		NodeClass: WeldInstagramPosts,
		scraperId: "instagram-posts",
		sampleUrl: "https://instagram.com/p/ABC123",
	},
	{
		name: "WeldInstagramComments",
		NodeClass: WeldInstagramComments,
		scraperId: "instagram-comments",
		sampleUrl: "https://instagram.com/p/ABC123",
	},
	{
		name: "WeldTikTokProfiles",
		NodeClass: WeldTikTokProfiles,
		scraperId: "tiktok-profiles",
		sampleUrl: "https://tiktok.com/@username",
	},
	{
		name: "WeldTikTokVideos",
		NodeClass: WeldTikTokVideos,
		scraperId: "tiktok-posts",
		sampleUrl: "https://tiktok.com/@user/video/123",
	},
	{
		name: "WeldTwitterProfiles",
		NodeClass: WeldTwitterProfiles,
		scraperId: "twitter-profiles",
		sampleUrl: "https://x.com/username",
	},
	{
		name: "WeldTwitterPosts",
		NodeClass: WeldTwitterPosts,
		scraperId: "twitter-posts",
		sampleUrl: "https://x.com/user/status/123",
	},
	{
		name: "WeldYouTubeChannels",
		NodeClass: WeldYouTubeChannels,
		scraperId: "youtube-channels",
		sampleUrl: "https://youtube.com/@channel",
	},
	{
		name: "WeldYouTubeComments",
		NodeClass: WeldYouTubeComments,
		scraperId: "youtube-comments",
		sampleUrl: "https://youtube.com/watch?v=abc123",
	},
	{
		name: "WeldFacebookProfiles",
		NodeClass: WeldFacebookProfiles,
		scraperId: "facebook-profiles",
		sampleUrl: "https://facebook.com/username",
	},
	{
		name: "WeldFacebookGroups",
		NodeClass: WeldFacebookGroups,
		scraperId: "facebook-groups",
		sampleUrl: "https://facebook.com/groups/groupname",
	},
];

for (const { name, NodeClass, scraperId, sampleUrl } of SCRAPERS) {
	describe(name, () => {
		const node = new NodeClass();

		it("should have usableAsTool enabled", () => {
			expect(node.description.usableAsTool).toBe(true);
		});

		it("should have create, get, and getResults operations", () => {
			const opProp = node.description.properties.find(
				(p) => p.name === "operation"
			);
			expect(opProp).toBeDefined();
			const values = (opProp!.options as Array<{ value: string }>).map(
				(o) => o.value
			);
			expect(values).toContain("create");
			expect(values).toContain("get");
			expect(values).toContain("getResults");
		});

		it("should POST to /api/jobs/create with correct scraperId", async () => {
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					operation: "create",
					urls: sampleUrl,
					jobName: "",
					waitForCompletion: false,
				},
				httpHandler: () => mockCreateJobResponse,
			});

			await exec(node, mock);

			const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
			const request = call[1] as {
				method: string;
				url: string;
				body: { scraperId: string; inputs: { url: string }[] };
			};
			expect(request.method).toBe("POST");
			expect(request.url).toContain("/api/jobs/create");
			expect(request.body.scraperId).toBe(scraperId);
			expect(request.body.inputs).toEqual([{ url: sampleUrl }]);
		});

		it("should parse multi-line URLs", async () => {
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					operation: "create",
					urls: `${sampleUrl}\n${sampleUrl}?v=2`,
					jobName: "",
					waitForCompletion: false,
				},
				httpHandler: () => mockCreateJobResponse,
			});

			await exec(node, mock);

			const call = mock.helpers.httpRequestWithAuthentication.mock.calls[0];
			const body = (call[1] as { body: { inputs: unknown[] } }).body;
			expect(body.inputs).toHaveLength(2);
		});

		it("should throw on empty URLs", async () => {
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					operation: "create",
					urls: "  ",
					jobName: "",
					waitForCompletion: false,
				},
			});

			await expect(exec(node, mock)).rejects.toThrow(NodeOperationError);
		});

		it("should reject URLs without http(s) protocol", async () => {
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					operation: "create",
					urls: "not-a-url",
					jobName: "",
					waitForCompletion: false,
				},
			});

			await expect(exec(node, mock)).rejects.toThrow(/must start with http/);
		});

		it("should reject URLs from the wrong platform", async () => {
			const wrongUrl = name.includes("LinkedIn")
				? "https://instagram.com/wrong"
				: "https://linkedin.com/in/wrong";
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					operation: "create",
					urls: wrongUrl,
					jobName: "",
					waitForCompletion: false,
				},
			});

			await expect(exec(node, mock)).rejects.toThrow(/Wrong platform/);
		});

		it("should accept subdomain URLs for the platform", async () => {
			const subdomainUrl = sampleUrl.replace("://", "://www.");
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					operation: "create",
					urls: subdomainUrl,
					jobName: "",
					waitForCompletion: false,
				},
				httpHandler: () => mockCreateJobResponse,
			});

			const result = await exec(node, mock);
			expect(result[0][0].json).toHaveProperty("jobId");
		});

		it("should get job by ID", async () => {
			const mockJob = { job: { _id: "j1", status: "completed" } };
			const mock = createMockExecuteFunctions({
				nodeParameters: { operation: "get", jobId: "j1" },
				httpHandler: () => mockJob,
			});

			const result = await exec(node, mock);

			expect(result[0][0].json).toEqual(mockJob.job);
		});

		it("should get results by job ID", async () => {
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					operation: "getResults",
					jobId: "j1",
					returnAll: false,
					limit: 50,
				},
				httpHandler: () => mockResults,
			});

			const result = await exec(node, mock);

			expect(result[0]).toHaveLength(2);
			expect(result[0][0].json).toMatchObject({ name: "Jane Doe" });
		});

		it("should poll and return results when waitForCompletion is true", async () => {
			vi.useFakeTimers({ shouldAdvanceTime: true });

			let pollCount = 0;
			const mock = createMockExecuteFunctions({
				nodeParameters: {
					operation: "create",
					urls: sampleUrl,
					jobName: "",
					waitForCompletion: true,
					pollInterval: 1,
					maxWait: 30,
					resultLimit: 1000,
				},
				httpHandler: (req) => {
					if (req.method === "POST") return mockCreateJobResponse;
					if (req.url.includes("/api/jobs/get")) {
						pollCount++;
						if (pollCount <= 1) return mockJobProcessing;
						return mockJobCompleted;
					}
					if (req.url.includes("/api/jobs/results")) return mockResults;
					return {};
				},
			});

			const result = await exec(node, mock);
			vi.useRealTimers();

			expect(result[0].length).toBe(2);
			expect(result[0][0].json).toMatchObject({
				_jobId: "job_abc123",
				_scraperId: scraperId,
			});
		});
	});
}
