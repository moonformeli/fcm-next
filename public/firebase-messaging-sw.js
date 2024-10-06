// firebase-messaging-sw.js

importScripts(
  'https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js'
);

self.addEventListener('install', () => {
  console.log('Service worker 설치됨');

  self.skipWaiting();
});

self.addEventListener('activate', () => {
  console.log('fcm service worker가 실행되었습니다.');
});

self.addEventListener('message', (event) => {
  console.log('??', event);
});

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyCDEI0ddzqiVhZDMEyJtP2hNCxe46lacB0',
  authDomain: 'fcm-test-a4d5e.firebaseapp.com',
  projectId: 'fcm-test-a4d5e',
  storageBucket: 'fcm-test-a4d5e.appspot.com',
  messagingSenderId: '421314617430',
  appId: '1:421314617430:web:7a2e574cbf98c4a7351bf7',
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('백그라운드 알람!!!', payload);

  // Customize the notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image, // 알림에 사용할 아이콘 경로ㅋ
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
