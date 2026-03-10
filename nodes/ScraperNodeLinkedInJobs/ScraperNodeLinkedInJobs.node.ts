import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeLinkedInJobs extends buildScraperNodeClass({
	scraperId: "linkedin-jobs",
	displayName: "ScraperNode LinkedIn Jobs",
	nodeName: "scraperNodeLinkedInJobs",
	description:
		"Extract job listing data including title, company, location, and requirements from LinkedIn",
	inputLabel: "Job Listing URLs",
	inputDescription:
		"LinkedIn job listing URLs (linkedin.com/jobs/view/...) — one per line or comma-separated",
	inputPlaceholder: "https://linkedin.com/jobs/view/1234567890",
	creditCost: 1,
	platform: "linkedin",
	allowedDomains: ["linkedin.com"],
}) {}
