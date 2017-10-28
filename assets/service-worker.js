(function () {
    'use strict';

    self.addEventListener('install', function (event) {
        console.log('Service worker installing...');

        // this is a good place for caching static assets.

        // It is possible for a new service worker to activate immediately, even if an existing service
        //worker is present, by skipping the waiting phase.
        self.skipWaiting();
    });

    self.addEventListener('activate', function (event) {
        console.log('Service worker activating...');

        // this is a good place to update caches
    });

    // Intercept network requests (within the scope of this service worker)
    self.addEventListener('fetch', function (event) {
        console.log('Fetching:', event.request.url);
    });

})();
