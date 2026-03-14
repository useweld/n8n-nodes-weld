import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeG2Reviews extends buildScraperNodeClass({
	scraperId: "g2-reviews",
	displayName: "ScraperNode G2 Reviews",
	nodeName: "scraperNodeG2Reviews",
	description:
		"Extract software product reviews from G2 with ratings, pros/cons, and reviewer details",
	inputLabel: "G2 URLs",
	inputDescription:
		"G2 product review URLs (g2.com/products/.../reviews) — one per line",
	inputPlaceholder: "https://g2.com/products/product-name/reviews",
	creditCost: 1,
	platform: "g2",
	allowedDomains: ["g2.com"],
}) {}
