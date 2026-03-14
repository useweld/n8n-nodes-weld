import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeGoogleMapsReviews extends buildScraperNodeClass({
	scraperId: "google-maps-reviews",
	displayName: "ScraperNode Google Maps Reviews",
	nodeName: "scraperNodeGoogleMapsReviews",
	description:
		"Extract customer reviews from Google Maps business listings",
	inputLabel: "Google Maps URLs",
	inputDescription:
		"Google Maps place URLs (google.com/maps/place/...) — one per line",
	inputPlaceholder: "https://google.com/maps/place/business-name",
	creditCost: 1,
	platform: "google-maps",
	allowedDomains: ["google.com"],
}) {}
