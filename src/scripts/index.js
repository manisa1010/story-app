import "leaflet/dist/leaflet.css";
import "../styles/styles.css";
import App from "./app";
import L from "leaflet";
import NotificationHelper from "./utils/notification-helper";

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

window.addEventListener("load", () => {
  app.renderPage();

  const token = localStorage.getItem("storyAppToken");
  if (token) {
    NotificationHelper.subscribeUser(token);
  }
});
