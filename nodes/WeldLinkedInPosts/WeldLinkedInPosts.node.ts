import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldLinkedInPosts extends buildScraperNodeClass({
	scraperId: "linkedin-posts",
	displayName: "Weld LinkedIn Posts",
	nodeName: "weldLinkedInPosts",
	description:
		"Extract posts with engagement metrics from LinkedIn profile, company, or post URLs",
	inputLabel: "Profile, Company, or Post URLs",
	inputDescription:
		"LinkedIn URLs to scrape posts from — profile, company, or direct post URLs",
	inputPlaceholder: "https://linkedin.com/in/janedoe",
	creditCost: 3,
	platform: "linkedin",
	allowedDomains: ["linkedin.com"],
}) {}
