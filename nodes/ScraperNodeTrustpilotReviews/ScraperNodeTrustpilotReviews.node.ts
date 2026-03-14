import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeTrustpilotReviews extends buildScraperNodeClass({
	scraperId: "trustpilot-reviews",
	displayName: "ScraperNode Trustpilot Reviews",
	nodeName: "scraperNodeTrustpilotReviews",
	description:
		"Extract business reviews from Trustpilot with ratings, reviewer details, and response data",
	inputLabel: "Trustpilot URLs",
	inputDescription:
		"Trustpilot business review URLs (trustpilot.com/review/...) — one per line",
	inputPlaceholder: "https://trustpilot.com/review/domain.com",
	creditCost: 1,
	platform: "trustpilot",
	allowedDomains: ["trustpilot.com"],
}) {}
