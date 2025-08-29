const CACHE_NAME = 'coin-tracker-cache-v3';
// All the files that make up the "app shell"
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/hooks/useLocalStorage.ts',
  '/components/Header.tsx',
  '/components/MainScreen.tsx',
  '/components/HistoryScreen.tsx',
  '/components/ActionButton.tsx',
  '/components/InstallPWA.tsx',
  '/components/icons/CoinIcon.tsx',
  '/components/icons/HistoryIcon.tsx',
  '/components/icons/HomeIcon.tsx',
  '/components/icons/TrashIcon.tsx',
  '/components/icons/DownloadIcon.tsx',
  '/manifest.json',
  '/icon.svg',
  'https://cdn.tailwindcss.com',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        // Use addAll to fetch and cache all URLs. If any fetch fails, the installation fails.
        return cache.addAll(APP_SHELL_URLS);
      })
      .catch(error => {
          console.error('Failed to cache app shell:', error);
      })
  );
});

self.addEventListener('activate', event => {
  // This event fires after the service worker is installed and ready to take control.
  // It's a good place to clean up old caches.
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
    // We are using a "Stale-While-Revalidate" strategy.
    // This strategy will respond with a cached version if available,
    // and then fetch an update from the network to update the cache for the next time.
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(cachedResponse => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    // If we get a valid response from the network, update the cache.
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(error => {
                    // The network request failed, possibly because the user is offline.
                    // If we have a cached response, we've already served it.
                    console.warn('Network request failed for:', event.request.url);
                });

                // Return the cached response immediately if it exists,
                // otherwise wait for the network response.
                return cachedResponse || fetchPromise;
            });
        })
    );
});