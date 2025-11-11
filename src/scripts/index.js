import "leaflet/dist/leaflet.css";
import "../styles/styles.css";
import App from "./app";
import L from "leaflet";

const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

const PUSH_SUBSCRIPTION_ENDPOINT =
  "https://story-api.dicoding.dev/v1/notifications/subscribe";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeUser(token) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("❌ Notification permission not granted.");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const existingSubscription =
      await registration.pushManager.getSubscription();

    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

    const subscription =
      existingSubscription ||
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      }));

    const payload = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(
          String.fromCharCode(...new Uint8Array(subscription.getKey("p256dh")))
        ),
        auth: btoa(
          String.fromCharCode(...new Uint8Array(subscription.getKey("auth")))
        ),
      },
    };

    const response = await fetch(PUSH_SUBSCRIPTION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("❌ Gagal kirim subscription ke server.");
    } else {
      console.log("✅ Subscription berhasil dikirim ke server.");
    }
  } catch (error) {
    console.error("❌ Failed to subscribe user or send subscription:", error);
  }
}

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const swRegister = async () => {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./sw.js");
      console.log("Service worker registered successfully");
    } catch (e) {
      console.error("Failed to register service worker", e);
    }
  }
};

swRegister();

const app = new App({
  content: document.querySelector("#mainContent"),
  drawerButton: document.querySelector("#drawerButton"),
  navigationDrawer: document.querySelector("#drawer"),
});

window.addEventListener("hashchange", () => {
  app.renderPage();
});

window.addEventListener("load", async () => {
  app.renderPage();

  const token = localStorage.getItem("storyAppToken");
  console.log("Token ditemukan:", token);

  if (token && "serviceWorker" in navigator && "PushManager" in window) {
    console.log("Memanggil subscribeUser...");
    await subscribeUser(token);
  }
});
