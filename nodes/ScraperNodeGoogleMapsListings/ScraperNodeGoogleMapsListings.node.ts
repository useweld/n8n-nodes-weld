import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeGoogleMapsListings extends buildScraperNodeClass({
	scraperId: "google-maps-listings",
	displayName: "ScraperNode Google Maps Listings",
	nodeName: "scraperNodeGoogleMapsListings",
	description:
		"Extract business listings from Google Maps with contact info, hours, ratings, and reviews",
	inputLabel: "Google Maps URLs",
	inputDescription:
		"Google Maps place URLs (google.com/maps/place/...) — one per line",
	inputPlaceholder: "https://google.com/maps/place/business-name",
	creditCost: 1,
	platform: "google-maps",
	allowedDomains: ["google.com"],
}) {}
