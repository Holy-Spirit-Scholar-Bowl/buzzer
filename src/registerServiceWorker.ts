/* eslint-disable no-console */
import { register } from "register-service-worker";
import { vxm } from "@/store";
const addAlert = vxm.addAlert;
if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      addAlert(
        "The site has been cached, so you can view it offline (hint: you'll need to add it to the home screen or install it as an app first). To see what has changed, take a look at the changelog."
      );
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated(worker) {
      addAlert("There's new content available! Please reload the page to see it.");
      console.log(
        "New content is available; please refresh. (hint: if you're on a desktop or laptop, use control+shift+r or command+shift+r)"
      );
      worker.update();
      setTimeout(() => {
        window.location.reload(true);
      }, 1000)
    },
    offline() {
      addAlert(
        "No internet connection. You're running in offline mode. Although you can't connect or buzz, you can still change your name."
      );
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      addAlert(
        "There was an error registering a server worker - don't worry, this just means the site won't load offline"
      );
      console.error("Error during service worker registration:", error);
    },
  });
}