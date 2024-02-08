import { readJSON } from "./custom_modules/jsonReader.js";
import { setLocation } from "./custom_modules/locationModule.js";
import {
  locationSetter,
  renderResults,
} from "./custom_modules/renderUiModule.js";
import {
  onNewTabOpenPauseVideo,
  videoScroll,
  lazyLoadAndAutoPlayVideo,
} from "./custom_modules/videoModule.js";
import {
  searchRestaurants,
  setupSearchTimer,
} from "./custom_modules/searchModule.js";

// Main container for rendering video component
const appContainer = document.querySelector(".content");

// On DOMContentLoaded, fetch data and render results
document.addEventListener("DOMContentLoaded", async () => {
  if ("geolocation" in navigator) {
    // Handle collecting user location
    try {
      const tempLocation = await setLocation();
      locationSetter(tempLocation);
    } catch (error) {
      console.error(`Geolocation error: ${error}`);
    }
  } else {
    console.error("Geolocation is not available in this browser.");
  }
  // Handle setting user data and UI
  try {
    const data = await readJSON("../assets/data-restaurants.json");
    setupSearchTimer(data, renderResults, appContainer);
    const displayResults = await searchRestaurants(data);
    renderResults(displayResults, appContainer);
  } catch (error) {
    console.error(`Error loading data: ${error}`);
  }
});

// Add event listeners - load
window.addEventListener("load", () => {
  videoScroll();
  lazyLoadAndAutoPlayVideo();
});
// Add event listeners - scroll
window.addEventListener("scroll", () => {
  videoScroll();
  lazyLoadAndAutoPlayVideo();
});
// Add event listeners - visibilitychange
document.addEventListener("visibilitychange", onNewTabOpenPauseVideo);
