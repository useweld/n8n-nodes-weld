import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldTikTokProfiles extends buildScraperNodeClass({
	scraperId: "tiktok-profiles",
	displayName: "Weld TikTok Profiles",
	nodeName: "weldTikTokProfiles",
	description: "Extract creator profile data from TikTok user URLs",
	inputLabel: "Profile URLs",
	inputDescription:
		"TikTok profile URLs (tiktok.com/@username) — one per line or comma-separated",
	inputPlaceholder: "https://tiktok.com/@username",
	creditCost: 4,
	platform: "tiktok",
	allowedDomains: ["tiktok.com"],
}) {}
