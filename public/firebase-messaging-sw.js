// firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js"
);

if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY === undefined) {
  throw new Error("Firebase API Key is undefined");
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:
    "uri-creative.firebaseapp.com" ??
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: "uri-creative" ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    "uri-creative.appspot.com" ??
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    "597435210649" ?? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:
    "1:597435210649:web:810f00e02a7b2cd30a5108" ??
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:
    "G-9343V6T4ZQ" ?? process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener("message", (event) => {
  console.log("[Service Worker] Message Received:", event.data);

  // Handle the FCM message payload here
  const data = event.data.json();
  console.log("FCM Message Payload:", data);

  // You can update your UI or display a notification for foreground messages here
});

self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push Received.");

  const data = event.data
    ? event.data.json()
    : { title: "Hello!", body: "Uri says Hello!", icon: "👋" };
  console.log("Push message data:", data.notification);

  const notifData = data.notification;
  const options = {
    title: notifData.title,
    body: notifData.body,
    icon: notifData.icon,
  };

  event.waitUntil(self.registration.showNotification(notifData.title, options));
  console.log("Notification Sent: ", notifData.title);
});
