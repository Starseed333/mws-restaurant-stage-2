const staticCacheName = 'restaurant-reviews-v1';
//file images | scripts
const cached_urls = [
  '/',
  'restaurant.html',
  'css/styles.css',
  'css/responsiveStyle.css',
  'data/restaurants.json',
  'img/Busy_Restaurant.webp',
  'img/Empty_Restaurant.webp',
  'img/Outdoor_sign.webp',
  'img/Outside_Burger_Restaurant.webp',
  'img/Outside_Restaurant.webp',
  'img/People_Eating.webp',
  'img/People_sitting_Restaurant.webp',
  'img/Pizza.webp',
  'img/Round_table_restaurant.webp',
  'img/Table_with_Grill.webp',
  'js/dbhelper.webp',
  'js/main.webp',
  'js/restaurant_info.webp',
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
