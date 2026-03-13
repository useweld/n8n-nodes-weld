# n8n-nodes-scrapernode

[![npm version](https://img.shields.io/npm/v/n8n-nodes-scrapernode.svg)](https://www.npmjs.com/package/n8n-nodes-scrapernode)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[n8n](https://n8n.io/) community nodes for [**ScraperNode**](https://scrapernode.com) — extract structured data from LinkedIn, Instagram, TikTok, Twitter/X, YouTube, Facebook, Indeed, Glassdoor, Yelp, GitHub, and Crunchbase directly inside your n8n workflows.

> **31 scraper nodes** | **11 platforms** | **AI Agent compatible** | **Pay-per-scrape credits**

[Website](https://scrapernode.com) | [API Docs](https://scrapernode.com/docs/api) | [Get API Key](https://scrapernode.com/settings) | [npm](https://www.npmjs.com/package/n8n-nodes-scrapernode) | [Report Issues](https://github.com/ScraperNode/n8n-nodes-scrapernode/issues)

---

## Installation

### From the n8n UI (recommended)

1. Open your n8n instance
2. Go to **Settings > Community Nodes**
3. Select **Install a community node**
4. Enter `n8n-nodes-scrapernode`
5. Agree to the risks and click **Install**

After installation, the ScraperNode nodes appear in the node palette when you search "ScraperNode".

### From the command line

```bash
# Inside your n8n installation directory
npm install n8n-nodes-scrapernode
```

Then restart n8n.

### Docker

If you run n8n via Docker, add the package to your `N8N_CUSTOM_EXTENSIONS` or install it in your custom Dockerfile:

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-scrapernode
```

---

## Credentials

You need a ScraperNode API key to use these nodes.

1. Sign up at [scrapernode.com](https://scrapernode.com)
2. Go to **Settings > API Keys** in your [dashboard](https://scrapernode.com/settings)
3. Copy your API key (starts with `sn_...`)
4. In n8n, create a new **ScraperNode API** credential and paste your key

---

## Available Scrapers

### LinkedIn — [scrapernode.com/linkedin](https://scrapernode.com/linkedin)

| Node | Description | Fields | Cost |
|------|-------------|--------|------|
| [**Profiles**](https://scrapernode.com/linkedin/scrapers/profiles) | Extract professional profiles — experience, skills, education, certifications | 42 | 2 credits/row |
| [**Companies**](https://scrapernode.com/linkedin/scrapers/companies) | Extract company data — size, specialties, locations, follower counts | 10 | 2 credits/row |
| [**Posts**](https://scrapernode.com/linkedin/scrapers/posts) | Extract posts with engagement metrics — likes, comments, shares | 10 | 1 credit/row |
| [**Jobs**](https://scrapernode.com/linkedin/scrapers/jobs) | Extract job listings — title, salary, requirements, company details | 27 | 1 credit/row |
| [**People Search**](https://scrapernode.com/linkedin/scrapers/people-search) | Search and extract matching profiles by filters | 7 | 1 credit/row |

### Instagram — [scrapernode.com/instagram](https://scrapernode.com/instagram)

| Node | Description | Fields | Cost |
|------|-------------|--------|------|
| [**Profiles**](https://scrapernode.com/instagram/scrapers/profiles) | Extract profile data — followers, engagement rates, bio, contact info | 31 | 1 credit/row |
| [**Posts**](https://scrapernode.com/instagram/scrapers/posts) | Extract posts with captions, hashtags, engagement, media URLs | 29 | 1 credit/row |
| [**Comments**](https://scrapernode.com/instagram/scrapers/comments) | Extract comments with user details and sentiment data | 10 | 1 credit/row |
| [**Reels**](https://scrapernode.com/instagram/scrapers/reels) | Extract reels with views, engagement, audio, creator info | 27 | 1 credit/row |

### TikTok — [scrapernode.com/tiktok](https://scrapernode.com/tiktok)

| Node | Description | Fields | Cost |
|------|-------------|--------|------|
| [**Profiles**](https://scrapernode.com/tiktok/scrapers/profiles) | Extract creator profiles — followers, likes, video counts | 10 | 1 credit/row |
| [**Videos**](https://scrapernode.com/tiktok/scrapers/posts) | Extract videos with views, likes, shares, captions | 10 | 1 credit/row |
| [**Comments**](https://scrapernode.com/tiktok/scrapers/comments) | Extract comments with engagement and user details | 14 | 1 credit/row |

### Twitter/X — [scrapernode.com/twitter](https://scrapernode.com/twitter)

| Node | Description | Fields | Cost |
|------|-------------|--------|------|
| [**Profiles**](https://scrapernode.com/twitter/scrapers/profiles) | Extract profiles — followers, tweet count, bio, verification | 10 | 1 credit/row |
| [**Posts**](https://scrapernode.com/twitter/scrapers/posts) | Extract tweets with likes, retweets, replies, views | 10 | 1 credit/row |

### YouTube — [scrapernode.com/youtube](https://scrapernode.com/youtube)

| Node | Description | Fields | Cost |
|------|-------------|--------|------|
| [**Channels**](https://scrapernode.com/youtube/scrapers/channels) | Extract channel data — subscribers, views, video counts | 10 | 1 credit/row |
| [**Videos**](https://scrapernode.com/youtube/scrapers/videos) | Extract videos with transcripts, engagement, metadata | 43 | 1 credit/row |
| [**Comments**](https://scrapernode.com/youtube/scrapers/comments) | Extract comments with user details and engagement | 10 | 1 credit/row |

### Facebook — [scrapernode.com/facebook](https://scrapernode.com/facebook)

| Node | Description | Fields | Cost |
|------|-------------|--------|------|
| [**Profiles**](https://scrapernode.com/facebook/scrapers/profiles) | Extract page/profile data — followers, likes, contact info | 10 | 1 credit/row |
| [**Posts**](https://scrapernode.com/facebook/scrapers/posts) | Extract posts with engagement, media, reaction breakdowns | 36 | 1 credit/row |
| [**Comments**](https://scrapernode.com/facebook/scrapers/comments) | Extract comments with user details and replies | 22 | 1 credit/row |
| [**Groups**](https://scrapernode.com/facebook/scrapers/groups) | Extract group data — members, activity, admin details | 10 | 1 credit/row |
| [**Reels**](https://scrapernode.com/facebook/scrapers/reels) | Extract reels with views, engagement, audio data | 27 | 1 credit/row |

### Indeed — [scrapernode.com/indeed](https://scrapernode.com/indeed)

| Node | Description | Fields | Cost |
|------|-------------|--------|------|
| [**Jobs**](https://scrapernode.com/indeed/scrapers/jobs) | Extract job listings — salary, qualifications, company details | 25 | 1 credit/row |
| [**Companies**](https://scrapernode.com/indeed/scrapers/companies) | Extract company profiles — ratings, reviews, size, industry | 15 | 1 credit/row |

### Glassdoor — [scrapernode.com/glassdoor](https://scrapernode.com/glassdoor)

| Node | Description | Fields | Cost |
|------|-------------|--------|------|
| [**Companies**](https://scrapernode.com/glassdoor/scrapers/companies) | Extract company profiles — ratings, culture scores, financials | 49 | 2 credits/row |
| [**Reviews**](https://scrapernode.com/glassdoor/scrapers/reviews) | Extract employee reviews — pros, cons, rating breakdowns | 35 | 1 credit/row |
| [**Jobs**](https://scrapernode.com/glassdoor/scrapers/jobs) | Extract job listings with salary estimates and company ratings | 38 | 1 credit/row |

### Yelp — [scrapernode.com/yelp](https://scrapernode.com/yelp)

| Node | Description | Fields | Cost |
|------|-------------|--------|------|
| [**Businesses**](https://scrapernode.com/yelp/scrapers/businesses) | Extract business listings — ratings, hours, contact, amenities | 29 | 1 credit/row |
| [**Reviews**](https://scrapernode.com/yelp/scrapers/reviews) | Extract customer reviews — ratings, text, responses | 17 | 1 credit/row |

### GitHub — [scrapernode.com/github](https://scrapernode.com/github)

| Node | Description | Fields | Cost |
|------|-------------|--------|------|
| [**Repositories**](https://scrapernode.com/github/scrapers/repositories) | Extract repo data — stars, forks, languages, contributors | 20 | 2 credits/row |

### Crunchbase — [scrapernode.com/crunchbase](https://scrapernode.com/crunchbase)

| Node | Description | Fields | Cost |
|------|-------------|--------|------|
| [**Companies**](https://scrapernode.com/crunchbase/scrapers/companies) | Extract company data — funding rounds, investors, growth metrics | 53 | 2 credits/row |

---

## Job Management

The **ScraperNode Jobs** node handles cross-cutting job management and credits:

| Resource | Operation | Description |
|----------|-----------|-------------|
| Job | **Get** | Get job status and details by ID |
| Job | **Get Results** | Retrieve scraped data from a completed job |
| Job | **List** | List recent scrape jobs with optional status filter |
| Job | **Cancel** | Cancel a pending/processing job and refund credits |
| Credits | **Get Balance** | Check your current credit balance |
| Credits | **Get Transactions** | View your credit transaction history |

---

## How to Use

1. Drag any ScraperNode node onto your workflow canvas
2. Select your **ScraperNode API** credential
3. Configure the inputs (URLs, usernames, search queries, etc.)
4. Execute the node to receive structured JSON data

Each scraper node supports three operations:

| Operation | Description |
|-----------|-------------|
| **Create** | Start a new scrape job — optionally wait for completion |
| **Get** | Check job status and details by ID |
| **Get Results** | Retrieve scraped data from a completed job |

### Wait for Completion

Enable **Wait for Completion** when creating a job to have the node poll until the job finishes, then output each scraped record as a separate n8n item — ready to pipe into the next node.

For long-running jobs, use the **ScraperNode Jobs** node's Get/Get Results operations on a schedule to avoid holding an n8n worker.

### AI Agent Support

All nodes are **AI Agent compatible** with `usableAsTool` enabled. Connect them to n8n's AI Agent node to let your AI agents scrape data on demand.

---

## Features

- **31 dedicated scraper nodes** — one per scraper, each with tailored inputs and platform-specific icons
- **AI Agent compatible** — focused tool descriptions for accurate tool selection by AI agents
- **Per-platform icons** — each scraper node displays its platform icon for easy identification on the canvas
- **Return All toggle** — standard n8n pagination for Get Results and List operations
- **Exponential backoff** — automatic retry on 5xx, 429, and network errors
- **Data provenance** — every output item includes `pairedItem` for n8n's data tracking
- **Dark mode** — icons adapt to n8n's light and dark themes
- **Pay per scrape** — no subscriptions, credits-based usage

---

## Links

| | |
|---|---|
| **Website** | [scrapernode.com](https://scrapernode.com) |
| **API Documentation** | [scrapernode.com/docs/api](https://scrapernode.com/docs/api) |
| **OpenAPI Spec** | [scrapernode.com/openapi.yaml](https://scrapernode.com/openapi.yaml) |
| **npm Package** | [npmjs.com/package/n8n-nodes-scrapernode](https://www.npmjs.com/package/n8n-nodes-scrapernode) |
| **GitHub** | [github.com/ScraperNode/n8n-nodes-scrapernode](https://github.com/ScraperNode/n8n-nodes-scrapernode) |
| **Issues** | [github.com/ScraperNode/n8n-nodes-scrapernode/issues](https://github.com/ScraperNode/n8n-nodes-scrapernode/issues) |

---

## License

[MIT](LICENSE)

---

### Tags

`n8n` `n8n-community-node` `n8n-community-node-package` `web-scraping` `scraping` `data-extraction` `lead-generation` `linkedin-scraper` `instagram-scraper` `tiktok-scraper` `twitter-scraper` `x-scraper` `youtube-scraper` `facebook-scraper` `indeed-scraper` `glassdoor-scraper` `yelp-scraper` `github-scraper` `crunchbase-scraper` `social-media-scraping` `social-media` `automation` `workflow` `api` `scrapernode` `linkedin` `instagram` `tiktok` `twitter` `youtube` `facebook` `indeed` `glassdoor` `yelp` `crunchbase` `influencer-marketing` `competitor-analysis` `market-research` `talent-sourcing` `job-scraping` `review-scraping` `profile-scraping` `ai-agent` `n8n-ai-agent`
