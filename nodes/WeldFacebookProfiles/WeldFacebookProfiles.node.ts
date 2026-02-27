import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldFacebookProfiles extends buildScraperNodeClass({
	scraperId: "facebook-profiles",
	displayName: "Weld Facebook Profiles",
	nodeName: "weldFacebookProfiles",
	description: "Extract profile and post data from Facebook profile URLs",
	inputLabel: "Profile URLs",
	inputDescription:
		"Facebook profile URLs (facebook.com/username) — one per line or comma-separated",
	inputPlaceholder: "https://facebook.com/username",
	creditCost: 4,
	platform: "facebook",
	allowedDomains: ["facebook.com", "fb.com"],
}) {}
