import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldYelpBusinesses extends buildScraperNodeClass({
	scraperId: "yelp-businesses",
	displayName: "Weld Yelp Businesses",
	nodeName: "weldYelpBusinesses",
	description:
		"Extract business profiles with ratings from Yelp business pages",
	inputLabel: "Business URLs",
	inputDescription:
		"Yelp business page URLs — one per line or comma-separated",
	inputPlaceholder: "https://yelp.com/biz/acme-restaurant-new-york",
	creditCost: 5,
	platform: "yelp",
	allowedDomains: [
		"yelp.com",
		"yelp.ca",
		"yelp.co.uk",
		"yelp.de",
		"yelp.fr",
		"yelp.com.au",
	],
}) {}
