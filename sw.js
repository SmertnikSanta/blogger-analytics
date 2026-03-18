// Название кэша с версией
const CACHE_NAME = 'blogger-analytics-v1.0.0';

// Файлы для кэширования
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-152.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker устанавливается...');
  
  // Кэшируем файлы
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэширование файлов...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Все файлы закэшированы');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Ошибка кэширования:', error);
      })
  );
});

// Активация и очистка старого кэша
self.addEventListener('activate', event => {
  console.log('Service Worker активируется...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker готов к работе');
      return self.clients.claim();
    })
  );
});

// Стратегия кэширования: сначала кэш, потом сеть (с офлайн-страницей)
self.addEventListener('fetch', event => {
  // Пропускаем запросы не к нашему сайту
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Если есть в кэше - возвращаем
        if (cachedResponse) {
          return cachedResponse;
        }

        // Если нет - запрашиваем из сети
        return fetch(event.request)
          .then(response => {
            // Проверяем валидность ответа
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Кэшируем новый файл
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('Ошибка загрузки, показываем офлайн-страницу');
            
            // Если запрос за HTML-страницей, показываем офлайн
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            return new Response('Нет соединения', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Обработка push-уведомлений (опционально)
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('Blogger Analytics', options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});