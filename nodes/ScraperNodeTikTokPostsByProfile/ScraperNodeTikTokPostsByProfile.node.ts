import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeTikTokPostsByProfile extends buildScraperNodeClass({
	scraperId: "tiktok-posts-by-profile",
	displayName: "ScraperNode TikTok Posts by Profile",
	nodeName: "scraperNodeTikTokPostsByProfile",
	description: "Extract all posts from a TikTok profile URL using Fast API",
	inputLabel: "Profile URLs",
	inputDescription:
		"TikTok profile URLs (tiktok.com/@username) — one per line",
	inputPlaceholder: "https://tiktok.com/@username",
	creditCost: 1,
	platform: "tiktok",
	allowedDomains: ["tiktok.com"],
}) {}
