import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeFacebookReels extends buildScraperNodeClass({
	scraperId: "facebook-reels",
	displayName: "ScraperNode Facebook Reels",
	nodeName: "scraperNodeFacebookReels",
	description:
		"Extract reel data from Facebook profiles with engagement metrics",
	inputLabel: "Profile URLs",
	inputDescription:
		"Facebook profile URLs (facebook.com/username) — one per line or comma-separated",
	inputPlaceholder: "https://facebook.com/username",
	creditCost: 1,
	platform: "facebook",
	allowedDomains: ["facebook.com", "fb.com"],
}) {}
