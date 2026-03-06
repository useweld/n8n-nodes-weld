import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
} from "n8n-workflow";
export const BASE_URL = "https://actions.useweld.app";

const MAX_RETRIES = 3;
const HTTP_5XX_RE = /5\d{2}/;
const HTTP_429_RE = /429/;
const NETWORK_ERROR_RE =
	/ECONNRESET|ETIMEDOUT|ENOTFOUND|socket hang up|network/i;

export const URL_SPLIT_RE = /[\n,]+/;

export function isRetryableError(error: unknown): boolean {
	if (!(error instanceof Error)) {
		return false;
	}
	const msg = error.message;
	return (
		HTTP_5XX_RE.test(msg) || HTTP_429_RE.test(msg) || NETWORK_ERROR_RE.test(msg)
	);
}

export async function httpWithRetry(
	ctx: IExecuteFunctions,
	options: IHttpRequestOptions
): Promise<IDataObject> {
	let retries = 0;
	while (true) {
		try {
			return (await ctx.helpers.httpRequestWithAuthentication.call(
				ctx,
				"weldApi",
				options
			)) as IDataObject;
		} catch (error) {
			if (retries < MAX_RETRIES && isRetryableError(error)) {
				retries++;
				const backoff = 1000 * 2 ** retries;
				await new Promise((resolve) => setTimeout(resolve, backoff));
				continue;
			}
			throw error;
		}
	}
}
