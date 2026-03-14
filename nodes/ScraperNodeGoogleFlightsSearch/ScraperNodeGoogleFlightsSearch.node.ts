import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeGoogleFlightsSearch extends buildScraperNodeClass({
	scraperId: "google-flights-search",
	displayName: "ScraperNode Google Flights Search",
	nodeName: "scraperNodeGoogleFlightsSearch",
	description:
		"Extract flight search results and pricing from Google Flights",
	inputLabel: "Google Flights URLs",
	inputDescription:
		"Google Flights search URLs (google.com/travel/flights/...) — one per line",
	inputPlaceholder: "https://google.com/travel/flights/search?tfs=...",
	creditCost: 1,
	platform: "google-flights",
	allowedDomains: ["google.com"],
}) {}
