import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldIndeedJobs extends buildScraperNodeClass({
	scraperId: "indeed-jobs",
	displayName: "Weld Indeed Jobs",
	nodeName: "weldIndeedJobs",
	description: "Extract job postings from Indeed job listing URLs",
	inputLabel: "Job URLs",
	inputDescription:
		"Indeed job listing URLs — one per line or comma-separated",
	inputPlaceholder: "https://indeed.com/viewjob?jk=abc123",
	creditCost: 5,
	platform: "indeed",
	allowedDomains: [
		"indeed.com",
		"indeed.co.uk",
		"indeed.ca",
		"indeed.co.in",
		"indeed.com.au",
		"indeed.de",
		"indeed.fr",
	],
}) {}
