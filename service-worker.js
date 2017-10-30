(function () {
    'use strict';

    // Set files to cache, paths relative to the service worker scope
    var CACHE_NAME = 'static-cache';
    var urlsToCache = [
        'gigs.html',
        'assets/css/styles.min.css',
        'assets/js/scripts.min.js'
    ];

    self.addEventListener('install', function (event) {
        console.log('Service worker installing...');

        // this is a good place for caching static assets.

        // Dont que behind any previous service worker, get straight on with it
        self.skipWaiting(
          // cache files given above
          caches.open(CACHE_NAME)
          .then( cache => {
              return cache.addAll(urlsToCache);
          })
        )

    });

    self.addEventListener('activate', function (event) {
        console.log('Service worker activating...');

        // this is a good place to update caches
    });

    // Intercept network requests (within the scope of this service worker)
    self.addEventListener('fetch', function (event) {
        console.log('Fetching:', event.request.url);

        event.respondWith(
          // Try to match the request with the cached files
          caches.match(event.request)
          .then(function (response) {

            console.log(response);

              //and if the resource is in the cache, then returns it.
              //if not, attempts to get the resource from the network using fetch.
              return response || fetch(event.request.url);
          })
        );

    });

    // function to fetch an asset from the network and then cache it
    function fetchAndCache(url) {
        return fetch(url)
            .then(function (response) {
                // Check if we received a valid response, runs the .catch() if it isn't
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                //If the response is valid, store it in the cache, and then returns the original response.
                return caches.open(CACHE_NAME)
                .then( function() {
                  cache.put(url, response.clone());
                  return response;
                })
            })
            .catch(function (error) {
                console.log('Request failed:', error);
                // You could return a custom offline 404 page here
            });
    }

})();
