import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeFacebookEvents extends buildScraperNodeClass({
	scraperId: "facebook-events",
	displayName: "ScraperNode Facebook Events",
	nodeName: "scraperNodeFacebookEvents",
	description:
		"Extract event data including date, location, attendees, and host details",
	inputLabel: "Event URLs",
	inputDescription:
		"Facebook event URLs (facebook.com/events/...) — one per line",
	inputPlaceholder: "https://facebook.com/events/123456789",
	creditCost: 1,
	platform: "facebook",
	allowedDomains: ["facebook.com"],
}) {}
