import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeFacebookPersonalProfiles extends buildScraperNodeClass({
	scraperId: "facebook-personal-profiles",
	displayName: "ScraperNode Facebook Personal Profiles",
	nodeName: "scraperNodeFacebookPersonalProfiles",
	description:
		"Extract personal Facebook profile data including work, education, and photos",
	inputLabel: "Profile URLs",
	inputDescription:
		"Facebook personal profile URLs (facebook.com/username) — one per line",
	inputPlaceholder: "https://facebook.com/username",
	creditCost: 1,
	platform: "facebook",
	allowedDomains: ["facebook.com"],
}) {}
