import { REFDIR_STATUS } from './const';

export async function fetchWrapper(url: string | URL, redirectCount: number, timeoutDuration: number, options: RequestInit): Promise<Response> {
	const timeoutController = new AbortController();
	const timeout = setTimeout(() => timeoutController.abort(), timeoutDuration);
	const res = await fetch(url, { signal: timeoutController.signal, redirect: 'manual', ...options });

	try {
		if (REFDIR_STATUS.includes(res.status)) {
			const location = res.headers.get('location');
			if (!location)
				return res;
			url = new URL(location, url);

			if (redirectCount > 0)
				return fetchWrapper(url, redirectCount - 1, timeoutDuration, options);
			else
				return res;
		}
		else { return res; }
	}
	finally {
		clearTimeout(timeout);
	}
}
