importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyAFvujebTVphL0I1bejYxAjiDvCiUcTlvg",
    authDomain: "pet-connecting.firebaseapp.com",
    projectId: "pet-connecting",
    storageBucket: "pet-connecting.firebasestorage.app",
    messagingSenderId: "376105723541",
    appId: "1:376105723541:web:8316632380977a2399dd9c"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    data: {
      url: "PetConnecting", // Usar la URL personalizada si está disponible
    },
    icon: "./logo-512.png"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});