import { buildScraperNodeClass } from "../shared/scraperNode";

export class WeldYouTubeChannels extends buildScraperNodeClass({
	scraperId: "youtube-channels",
	displayName: "Weld YouTube Channels",
	nodeName: "weldYouTubeChannels",
	description: "Extract channel data from YouTube channel URLs",
	inputLabel: "Channel URLs",
	inputDescription: "YouTube channel URLs — one per line or comma-separated",
	inputPlaceholder: "https://youtube.com/@channel",
	creditCost: 4,
	platform: "youtube",
	allowedDomains: ["youtube.com", "youtu.be"],
}) {}
