const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

const PUSH_SUBSCRIPTION_ENDPOINT =
  "https://story-api.dicoding.dev/v1/notifications/subscribe"; // ✅ diperbaiki

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const NotificationHelper = {
  async askPermission() {
    if (!("Notification" in window) || !("PushManager" in window)) {
      console.log("Push notification not supported by this browser.");
      return false;
    }

    const status = await Notification.requestPermission();
    if (status !== "granted") {
      console.log("Notification permission not granted.");
      return false;
    }

    console.log("Notification permission granted.");
    return true;
  },

  async subscribeUser(token) {
    if (!token) return null;

    const permission = await this.askPermission();
    if (!permission) return null;

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (subscription === null) {
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

        const response = await fetch(PUSH_SUBSCRIPTION_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ pastikan token valid
          },
          body: JSON.stringify(subscription),
        });

        if (!response.ok) {
          throw new Error("Gagal menyimpan push subscription ke server.");
        }

        console.log("Push subscription successfully sent to server.");
      } catch (e) {
        console.error("Failed to subscribe user or send subscription:", e);
        return null;
      }
    }

    return subscription;
  },
};

export default NotificationHelper;
