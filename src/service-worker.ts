self.addEventListener('fetch', (event: FetchEvent) => {
	// add to cache on network hit (network first)
	event.respondWith(
		fetch(event.request)
			.then(async (response) => {
				const cache = await caches.open('timer');

				// only cache GET requests which are not chrome-extension
				if (event.request.method === 'GET' && !event.request.url.includes('chrome-extension')) {
					cache.put(event.request, response.clone());
				}
				return response;
			})
			.catch(async () => {
				// if network fails, return from cache
				const cache = await caches.open('timer');
				return cache.match(event.request);
			}) as Promise<Response>
	);
});

export {};
declare const self: ServiceWorkerGlobalScope;
