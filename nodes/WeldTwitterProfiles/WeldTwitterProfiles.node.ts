import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldTwitterProfiles extends buildScraperNodeClass({
	scraperId: "twitter-profiles",
	displayName: "Weld Twitter/X Profiles",
	nodeName: "weldTwitterProfiles",
	description: "Extract profile data from Twitter/X user URLs",
	inputLabel: "Profile URLs",
	inputDescription:
		"Twitter/X profile URLs (x.com/username) — one per line or comma-separated",
	inputPlaceholder: "https://x.com/username",
	creditCost: 4,
	platform: "twitter",
	allowedDomains: ["twitter.com", "x.com"],
}) {}
