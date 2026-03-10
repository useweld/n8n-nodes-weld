import { buildScraperNodeClass } from "../shared/scraperNode";

export class ScraperNodeYouTubeVideos extends buildScraperNodeClass({
	scraperId: "youtube-videos",
	displayName: "ScraperNode YouTube Videos",
	nodeName: "scraperNodeYouTubeVideos",
	description:
		"Extract video data including views, likes, transcript, and metadata from YouTube",
	inputLabel: "Video URLs",
	inputDescription:
		"YouTube video URLs (youtube.com/watch?v=...) — one per line or comma-separated",
	inputPlaceholder: "https://youtube.com/watch?v=videoId",
	creditCost: 1,
	platform: "youtube",
	allowedDomains: ["youtube.com", "youtu.be"],
}) {}
