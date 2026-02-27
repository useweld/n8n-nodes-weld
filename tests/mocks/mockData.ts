/** Mock API responses matching the Weld REST API shape. */

export const mockCreateJobResponse = {
	jobId: "job_abc123",
	status: "pending",
	message: "Job created successfully",
};

export const mockJobPending = {
	job: {
		_id: "job_abc123",
		status: "pending",
		scraperId: "linkedin-profiles",
		name: "Test Job",
		recordCount: 0,
		createdAt: "2026-01-15T10:00:00Z",
	},
};

export const mockJobProcessing = {
	job: {
		_id: "job_abc123",
		status: "processing",
		scraperId: "linkedin-profiles",
		name: "Test Job",
		recordCount: 0,
		createdAt: "2026-01-15T10:00:00Z",
	},
};

export const mockJobCompleted = {
	job: {
		_id: "job_abc123",
		status: "completed",
		scraperId: "linkedin-profiles",
		name: "Test Job",
		recordCount: 2,
		createdAt: "2026-01-15T10:00:00Z",
		completedAt: "2026-01-15T10:01:30Z",
	},
};

export const mockJobFailed = {
	job: {
		_id: "job_abc123",
		status: "failed",
		scraperId: "linkedin-profiles",
		name: "Test Job",
		errorMessage: "Rate limit exceeded for this platform",
		createdAt: "2026-01-15T10:00:00Z",
	},
};

export const mockResults = {
	results: [
		{
			data: {
				name: "Jane Doe",
				headline: "Software Engineer at Acme",
				location: "San Francisco, CA",
				profileUrl: "https://linkedin.com/in/janedoe",
			},
		},
		{
			data: {
				name: "John Smith",
				headline: "Product Manager at BigCorp",
				location: "New York, NY",
				profileUrl: "https://linkedin.com/in/johnsmith",
			},
		},
	],
};

export const mockEmptyResults = {
	results: [],
};

export const mockJobsList = {
	jobs: [
		{
			_id: "job_1",
			status: "completed",
			scraperId: "linkedin-profiles",
			name: "Batch 1",
			recordCount: 10,
		},
		{
			_id: "job_2",
			status: "processing",
			scraperId: "instagram-profiles",
			name: "Batch 2",
			recordCount: 0,
		},
		{
			_id: "job_3",
			status: "failed",
			scraperId: "twitter-profiles",
			name: "Batch 3",
			recordCount: 0,
		},
	],
};

export const mockCreditBalance = {
	balance: 5000,
	currency: "credits",
};

export const mockTransactions = {
	transactions: [
		{
			_id: "txn_1",
			type: "debit",
			amount: -50,
			description: "Job: linkedin-profiles (10 records)",
			createdAt: "2026-01-15T10:01:30Z",
		},
		{
			_id: "txn_2",
			type: "credit",
			amount: 1000,
			description: "Credit purchase via Stripe",
			createdAt: "2026-01-14T08:00:00Z",
		},
		{
			_id: "txn_3",
			type: "debit",
			amount: -20,
			description: "Job: youtube-comments (10 records)",
			createdAt: "2026-01-13T15:30:00Z",
		},
	],
};
