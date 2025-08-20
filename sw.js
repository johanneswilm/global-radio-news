// Global Radio News Service Worker
const CACHE_NAME = 'global-radio-news-v1.0.0';
const STATIC_CACHE_NAME = 'static-v1.0.0';
const RUNTIME_CACHE_NAME = 'runtime-v1.0.0';

// Files to cache on install
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './config.js',
  './manifest.json'
];

// Runtime cache patterns
const RUNTIME_CACHE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:js|css|html)$/,
  /^https:\/\/fonts\./,
  /^https:\/\/cdn\./
];

// Network-first patterns (for feeds and dynamic content)
const NETWORK_FIRST_PATTERNS = [
  /config\.json$/,
  /\.php$/,
  /feed/i,
  /rss/i,
  /podcast/i,
  /api/i
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== RUNTIME_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Skip audio streams (they should not be cached)
  if (request.url.includes('.m3u8') || 
      request.url.includes('.mp3') || 
      request.url.includes('.aac') ||
      request.destination === 'audio') {
    return;
  }
  
  // Handle different request types with appropriate strategies
  if (isNetworkFirst(request.url)) {
    event.respondWith(networkFirst(request));
  } else if (isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache-first strategy for static assets
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Cache-first failed:', error);
    return caches.match('./index.html');
  }
}

// Network-first strategy for dynamic content
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('./index.html');
    }
    
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(error => {
    console.log('[SW] Network failed for:', request.url);
    return null;
  });
  
  return cachedResponse || await fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.endsWith(asset)) ||
         RUNTIME_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

function isNetworkFirst(url) {
  return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url));
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Update configuration and feeds when back online
    const configResponse = await fetch('./config.json');
    if (configResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put('./config.json', configResponse.clone());
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Handle push notifications (for future use)
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const options = {
    body: event.data.text(),
    icon: './icon-192x192.png',
    badge: './icon-72x72.png',
    tag: 'radio-news',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Listen Now'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Global Radio News', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CACHE_URLS':
      event.waitUntil(
        caches.open(RUNTIME_CACHE_NAME)
          .then(cache => cache.addAll(data.urls))
      );
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.delete(RUNTIME_CACHE_NAME)
          .then(() => caches.open(RUNTIME_CACHE_NAME))
      );
      break;
      
    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// Periodic background fetch (for supported browsers)
self.addEventListener('backgroundfetch', event => {
  if (event.tag === 'update-feeds') {
    event.waitUntil(updateFeeds());
  }
});

async function updateFeeds() {
  try {
    // Update RSS feeds and podcast data
    const cache = await caches.open(RUNTIME_CACHE_NAME);
    
    // This would be expanded based on the actual feed URLs from config
    const feedUrls = [
      './combined-feed.php'
    ];
    
    for (const url of feedUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          cache.put(url, response.clone());
        }
      } catch (error) {
        console.log('[SW] Failed to update feed:', url, error);
      }
    }
  } catch (error) {
    console.error('[SW] Background fetch failed:', error);
  }
}

// Error handling
self.addEventListener('error', event => {
  console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service Worker loaded');