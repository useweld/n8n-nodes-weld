import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeTrustRadiusReviews extends buildScraperNodeClass({
	scraperId: "trustradius-reviews",
	displayName: "ScraperNode TrustRadius Reviews",
	nodeName: "scraperNodeTrustRadiusReviews",
	description:
		"Extract verified software product reviews from TrustRadius with detailed ratings",
	inputLabel: "Product Review URLs",
	inputDescription:
		"TrustRadius product review URLs (trustradius.com/products/.../reviews) — one per line",
	inputPlaceholder: "https://trustradius.com/products/product-name/reviews",
	creditCost: 1,
	platform: "trustradius",
	allowedDomains: ["trustradius.com"],
}) {}
