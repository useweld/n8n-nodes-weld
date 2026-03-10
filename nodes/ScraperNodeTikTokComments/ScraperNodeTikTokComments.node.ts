import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeTikTokComments extends buildScraperNodeClass({
	scraperId: "tiktok-comments",
	displayName: "ScraperNode TikTok Comments",
	nodeName: "scraperNodeTikTokComments",
	description: "Extract comments from TikTok videos with user details",
	inputLabel: "Video URLs",
	inputDescription:
		"TikTok video URLs (tiktok.com/@user/video/...) — one per line or comma-separated",
	inputPlaceholder: "https://tiktok.com/@user/video/123",
	creditCost: 1,
	platform: "tiktok",
	allowedDomains: ["tiktok.com"],
}) {}
