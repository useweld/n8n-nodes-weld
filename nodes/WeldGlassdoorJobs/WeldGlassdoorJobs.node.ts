import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldGlassdoorJobs extends buildScraperNodeClass({
	scraperId: "glassdoor-jobs",
	displayName: "Weld Glassdoor Jobs",
	nodeName: "weldGlassdoorJobs",
	description:
		"Extract job listings with salary estimates from Glassdoor job pages",
	inputLabel: "Job URLs",
	inputDescription:
		"Glassdoor job listing URLs — one per line or comma-separated",
	inputPlaceholder:
		"https://glassdoor.com/Job/acme-corp-software-engineer-JV12345.htm",
	creditCost: 5,
	platform: "glassdoor",
	allowedDomains: [
		"glassdoor.com",
		"glassdoor.ca",
		"glassdoor.co.uk",
		"glassdoor.co.in",
		"glassdoor.com.au",
		"glassdoor.de",
		"glassdoor.fr",
	],
}) {}
