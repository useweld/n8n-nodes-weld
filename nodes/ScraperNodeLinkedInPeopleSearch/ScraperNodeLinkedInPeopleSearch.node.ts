import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeLinkedInPeopleSearch extends buildScraperNodeClass({
	scraperId: "linkedin-people-search",
	displayName: "ScraperNode LinkedIn People Search",
	nodeName: "scraperNodeLinkedInPeopleSearch",
	description:
		"Discover LinkedIn profiles by searching with people search URLs",
	inputLabel: "Search URLs",
	inputDescription:
		"LinkedIn people search URLs (linkedin.com/search/results/people/...) — one per line or comma-separated",
	inputPlaceholder: "https://linkedin.com/search/results/people/",
	creditCost: 1,
	platform: "linkedin",
	allowedDomains: ["linkedin.com"],
}) {}
