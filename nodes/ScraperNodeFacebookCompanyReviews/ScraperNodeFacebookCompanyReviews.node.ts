import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeFacebookCompanyReviews extends buildScraperNodeClass({
	scraperId: "facebook-company-reviews",
	displayName: "ScraperNode Facebook Company Reviews",
	nodeName: "scraperNodeFacebookCompanyReviews",
	description:
		"Extract company page reviews with ratings, reviewer details, and reply data",
	inputLabel: "Company Page URLs",
	inputDescription:
		"Facebook company page URLs (facebook.com/company-page) — one per line",
	inputPlaceholder: "https://facebook.com/company-page",
	creditCost: 1,
	platform: "facebook",
	allowedDomains: ["facebook.com"],
}) {}
