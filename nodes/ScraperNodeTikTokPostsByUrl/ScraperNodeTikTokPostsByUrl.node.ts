import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeTikTokPostsByUrl extends buildScraperNodeClass({
	scraperId: "tiktok-posts-by-url",
	displayName: "ScraperNode TikTok Posts by URL",
	nodeName: "scraperNodeTikTokPostsByUrl",
	description: "Extract TikTok post data by direct video URL using Fast API",
	inputLabel: "Video URLs",
	inputDescription:
		"TikTok video URLs (tiktok.com/@user/video/id) — one per line",
	inputPlaceholder: "https://tiktok.com/@user/video/123",
	creditCost: 1,
	platform: "tiktok",
	allowedDomains: ["tiktok.com"],
}) {}
