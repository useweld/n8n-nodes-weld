import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeXingProfiles extends buildScraperNodeClass({
	scraperId: "xing-profiles",
	displayName: "ScraperNode Xing Profiles",
	nodeName: "scraperNodeXingProfiles",
	description:
		"Extract professional profiles from Xing, the European LinkedIn alternative",
	inputLabel: "Profile URLs",
	inputDescription:
		"Xing profile URLs (xing.com/profile/...) — one per line",
	inputPlaceholder: "https://xing.com/profile/firstname_lastname",
	creditCost: 1,
	platform: "xing",
	allowedDomains: ["xing.com"],
}) {}
