const staticCacheName = 'restaurant-reviews-v7';

self.addEventListener('install', function(event) {
  console.log("Service Worker installed");
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        './',
        './index.html',
        './restaurant.html',
        './service_worker.js',
        './css/responsive_index.css',
        './css/responsive_restaurant.css',
        './css/styles.css',
        './data/restaurants.json',
        './img/1.jpg',
        './img/2.jpg',
        './img/3.jpg',
        './img/4.jpg',
        './img/5.jpg',
        './img/6.jpg',
        './img/7.jpg',
        './img/8.jpg',
        './img/9.jpg',
        './img/10.jpg',
        './js/dbhelper.js',
        './js/indexController.js',
        './js/main.js',
        './js/restaurant_info.js',
      ]);
    })
  );
  console.log("cache successful");
});

// deletes old cache
self.addEventListener('activate', function(event) {
  console.log("Service Worker activated");
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-reviews-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
      console.log("Old cache removed");
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log("Service Worker fetch");
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log("Service Worker found in cache", event.request.url, response);
        return response;
      }
      // I'm going to try and cache.put new request just to see.
      caches.open(staticCacheName).then(function(cache) {
        fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          console.log("Service Worker just cached new data", event.request.url, response);
          return response;
        }).catch(function(error) {
          console.log("Uh oh, something went wrong with fetching new data", error);
        });
      });
      // End cache.put
    })
  );
});