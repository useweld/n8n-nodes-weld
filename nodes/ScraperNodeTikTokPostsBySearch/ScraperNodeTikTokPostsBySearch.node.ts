import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeTikTokPostsBySearch extends buildScraperNodeClass({
	scraperId: "tiktok-posts-by-search",
	displayName: "ScraperNode TikTok Posts by Search",
	nodeName: "scraperNodeTikTokPostsBySearch",
	description: "Collect TikTok posts matching a search query using Fast API",
	inputLabel: "Search URLs",
	inputDescription:
		"TikTok search page URLs (tiktok.com/search?q=...) — one per line",
	inputPlaceholder: "https://tiktok.com/search?q=keyword",
	creditCost: 1,
	platform: "tiktok",
	allowedDomains: ["tiktok.com"],
}) {}
