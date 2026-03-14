import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeGoogleHotelsSearch extends buildScraperNodeClass({
	scraperId: "google-hotels-search",
	displayName: "ScraperNode Google Hotels Search",
	nodeName: "scraperNodeGoogleHotelsSearch",
	description:
		"Collect hotel listings, pricing, and reviews from Google Hotels",
	inputLabel: "Google Hotels URLs",
	inputDescription:
		"Google Hotels search URLs (google.com/travel/hotels/...) — one per line",
	inputPlaceholder: "https://google.com/travel/hotels/...",
	creditCost: 1,
	platform: "google-hotels",
	allowedDomains: ["google.com"],
}) {}
