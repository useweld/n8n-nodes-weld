import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeFacebookPagesAndProfiles extends buildScraperNodeClass({
	scraperId: "facebook-pages-and-profiles",
	displayName: "ScraperNode Facebook Pages & Profiles",
	nodeName: "scraperNodeFacebookPagesAndProfiles",
	description:
		"Extract Facebook page and profile data including categories, contact info, hours, and ratings",
	inputLabel: "Page or Profile URLs",
	inputDescription:
		"Facebook page or profile URLs (facebook.com/pagename) — one per line",
	inputPlaceholder: "https://facebook.com/pagename",
	creditCost: 1,
	platform: "facebook",
	allowedDomains: ["facebook.com"],
}) {}
