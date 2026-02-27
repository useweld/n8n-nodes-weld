import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldTikTokVideos extends buildScraperNodeClass({
	scraperId: "tiktok-posts",
	displayName: "Weld TikTok Videos",
	nodeName: "weldTikTokVideos",
	description: "Extract video data from TikTok video URLs",
	inputLabel: "Video URLs",
	inputDescription:
		"TikTok video URLs (tiktok.com/@user/video/id) — one per line or comma-separated",
	inputPlaceholder: "https://tiktok.com/@user/video/123456",
	creditCost: 3,
	platform: "tiktok",
	allowedDomains: ["tiktok.com"],
}) {}
