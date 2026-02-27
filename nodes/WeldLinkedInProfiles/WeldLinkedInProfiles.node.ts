import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldLinkedInProfiles extends buildScraperNodeClass({
	scraperId: "linkedin-profiles",
	displayName: "Weld LinkedIn Profiles",
	nodeName: "weldLinkedInProfiles",
	description: "Extract professional profile data from LinkedIn profile URLs",
	inputLabel: "Profile URLs",
	inputDescription:
		"LinkedIn profile URLs (linkedin.com/in/username) — one per line or comma-separated",
	inputPlaceholder: "https://linkedin.com/in/janedoe",
	creditCost: 5,
	platform: "linkedin",
	allowedDomains: ["linkedin.com"],
}) {}
