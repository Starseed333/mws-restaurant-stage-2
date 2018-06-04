const staticCacheName = 'restaurant-reviews-v1';
//file images | scripts
const cached_urls = [
  '/',
  'restaurant.html',
  'css/styles.css',
  'css/responsiveStyle.css',
  'data/restaurants.json',
  'img/Busy_Restaurant.jpg',
  'img/Empty_Restaurant.jpg',
  'img/Outdoor_sign.jpg',
  'img/Outside_Burger_Restaurant.jpg',
  'img/Outside_Restaurant.jpg',
  'img/People_Eating.jpg',
  'img/People_sitting_Restaurant.jpg',
  'img/Pizza.jpg',
  'img/Round_table_restaurant.jpg',
  'img/Table_with_Grill.jpg',
  'js/dbhelper.js',
  'js/main.js',
  'js/restaurant_info.js',
]

// cache
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(cached_urls);
    })
  );
});

// Retrieve data from cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(staticCacheName).then(function(cache){
      return cache.match(event.request).then(function(response){
        return response || fetch(event.request).then(function(response){
          cache.put(event.request, response.clone());
            console.log("new data included to cache", event.request.url);
            return response;
        }).catch(function(error){
            console.log("Error!! ", error);
        });
      });
    })
  );
});

//delete old cache
self.addEventListener('activate', function(event) {
  console.log("Success sw activated!!!");
  event.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.filter(function(cacheName){
          return cacheName.startsWith('restaurant-reviews-') &&
        cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

//fetch | error
self.addEventListener('fetch', function(event) {
  console.log("...Service Worker initiating the fetch!");
  event.respondWith(
    fetch(event.request).then(function(response){
      if (response.status == 404){
        return new Response ("Sorry no file!");
      }
      return response;
    }).catch(function(){
      //offline
      return new Response("Epic Fail");
    })
  );
});
