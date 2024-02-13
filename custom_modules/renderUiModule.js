import { calculateDistance } from "./mathModule.js";
import { toCamelCase, shuffleArray, goToWebPage } from "./helpers.js";
import { SVG } from "./svgModule.js";

// default user location
let userLocation = {
  latt: 43.03282736873194,
  long: -87.90676045754915,
};
/**
 * Renders a video element with different HTML based on the user's browser.
 * @param {string} src - The URL of the video file.
 * @param {string} poster - The URL of the video poster image.
 * @param {string} name - The name of the video.
 * @returns {string} - HTML code for the video element.
 */
const renderVideo = (src, poster, name) => {
  if (window.chrome) {
    // If the user's browser is Chrome, render the video element with specific attributes
    return `
      <video id="id_${toCamelCase(
        name
      )}" autoplay loop muted playsinline poster="${poster}">
        <source src="${src}" type="video/mp4">
        Your browser does not support HTML5 video.
      </video>`;
  } else {
    // For other browsers, render the video element with different attributes
    return `
      <video data-src="${src}" id="id_${toCamelCase(
      name
    )}" autoplay loop muted playsinline poster="${poster}">
        Your browser does not support HTML5 video.
      </video>`;
  }
};

/**
 * Changes the SVG fill color when the bookmark icon is clicked.
 * @param {Event} event - The click event object.
 */
const changeIconColorBookmark = (event) => {
  const clickedIcon = event.currentTarget.querySelector("#iconBookmark");
  if (clickedIcon.style.fill === "yellow") {
    // If the fill color is yellow, change it to none and the stroke color to white
    clickedIcon.style.fill = "none";
    clickedIcon.style.stroke = "white";
  } else {
    // If the fill color is not yellow, change it to yellow and the stroke color to yellow
    clickedIcon.style.fill = "yellow";
    clickedIcon.style.stroke = "yellow";
  }
  event.stopPropagation(); // Stop the event from propagating further
};

/**
 * Changes the SVG when the heart icon is clicked.
 * @param {Event} event - The click event object.
 */
const changeIconColorHeart = (event) => {
  const clickedIcon = event.currentTarget;
  if (clickedIcon.classList.contains("clicked")) {
    // If the heart icon is already clicked, revert it to the original SVG and remove the "clicked" class
    const oldSVG = SVG.heartSVG;
    clickedIcon.innerHTML = oldSVG;
    clickedIcon.classList.remove("clicked");
  } else {
    // If the heart icon is not clicked, replace it with a new SVG and add the "clicked" class
    const newSVGContent = SVG.redHearthSVG;
    clickedIcon.innerHTML = newSVGContent;
    clickedIcon.classList.add("clicked");
  }

  event.stopPropagation(); // Stop the event from propagating further
};

/**
 * Changes the SVG when the sound icon is clicked and toggles the video's muted state.
 * @param {Event} event - The click event object.
 */
const changeIconSound = (event) => {
  const clickedIcon = event.currentTarget;
  const videoId =
    clickedIcon.parentElement.parentElement.querySelector("video").id;
  const video = document.getElementById(videoId);

  if (clickedIcon.classList.contains("muted")) {
    // If the video is muted, change the icon to unmuted and unmute the video
    const oldSVG = SVG.soundSVG;
    clickedIcon.innerHTML = oldSVG;
    clickedIcon.classList.remove("muted");
    video.muted = false;
  } else {
    // If the video is not muted, change the icon to muted and mute the video
    const newSVGContent = mutedSoundSVG;
    clickedIcon.innerHTML = newSVGContent;
    clickedIcon.classList.add("muted");
    video.muted = true;
  }

  event.stopPropagation(); // Stop the event from propagating further
};

/**
 * HTML template for displaying a message when there are no search results.
 */
const noResultsHTML = `
  <div class="noRestaurant">
    <div class="notFoundImg">
      <img class="firstImg" src="assets/no_result.svg" alt="no restaurant found icon" width="100" height="100">
    </div>
    <h2>Oops! area.</h2>
    <p>Try broadening your search criteria</p>
    <p>No restaurants found <br />in this<br /> or check back later for updates.</p>
  </div>
`;
/**
 * Generates HTML for displaying basic restaurant information.
 * @param {Object} data - Object containing restaurant information.
 * @param {string} data.restaurantImage - URL of the restaurant image.
 * @param {string} data.restaurantName - Name of the restaurant.
 * @param {string} data.type - Type of the restaurant.
 * @returns {string} - HTML code for displaying the basic restaurant info.
 */
const renderUserInfoHTML = (data) => {
  const HTML = ` 
   <div class="user-info">
    <img class="user-image" src="${data.restaurantImage}" alt="User Image">
    <div class="user-details">
      <div class="user-title">${data.restaurantName}</div>
      <div class="user-subtitle">${data.type}</div>
    </div>
  </div>`;
  return HTML;
};

/**
 * Generates HTML for displaying SVG icons holder DIV.
 * @returns {string} - HTML code for displaying SVG icons holder DIV.
 */
const renderSVGIconsHTML = () => {
  const HTML = ` 
  <div class="icons-overlay">
    <div class="blurred-circle bookmark" id="Bookmark">
      <span class="icon">
        ${SVG.bookmarkSVG}
      </span>
    </div>
    
    <div id="iconHeart" class="blurred-circle heart">
      <span class="icon">
        ${SVG.heartSVG}
      </span>
    </div>
    
    <div class="blurred-circle planet">
      <span class="icon">
        ${SVG.planetSVG}
      </span>
    </div>

    <div id="soundIcon" class="blurred-circle sound muted">
      <span class="icon">
        ${SVG.soundSVG}
      </span>
    </div>
  </div>`;
  return HTML;
};

/**
 * Generates HTML for displaying detailed restaurant info and calculated distance between user and restaurant location.
 * @param {Object} restaurant - Object containing restaurant information.
 * @param {{ latt: number, long: number }} location - Object containing user's latitude and longitude coordinates.
 * @returns {string} - HTML code for displaying detailed restaurant info and calculated distance.
 */
const renderDescription = (restaurant, location) => {
  const HTML = `
  <div class="map-info">
    <div>
      <span class="map-icon">${SVG.mapSVG}</span>
      <span class="distance">Distance</span>
      <span class="bold-distance">
        ${calculateDistance(location, restaurant)} mi
      </span>
    </div>
    <p class="info-text">
      ${restaurant.description !== "NULL" ? restaurant.description : ""}
    </p>
  </div>`;
  return HTML;
};

/**
 * Generates HTML code for displaying the entire video component including restaurant user info, video, SVG icons, and detailed restaurant info.
 * @param {Object} restaurant - Object containing restaurant information.
 * @returns {string} - HTML code for displaying the entire video component.
 */
const videoHTML = (restaurant) => {
  const HTML = `
    ${renderUserInfoHTML(restaurant)}
    <div class="video-container" style="background-image:url(${
      restaurant.videoPosterSrc
    })">
      ${renderVideo(
        restaurant.videoSrc,
        restaurant.videoPosterSrc,
        restaurant.restaurantName
      )}
      <script>
        document.querySelectorAll('video').play();
      </script>
      ${renderSVGIconsHTML()}
    </div>

    ${renderDescription(restaurant, userLocation)}
  `;
  return HTML;
};

/**
 * Attaches event listeners to the SVG icons within the video wrapper element.
 * Provides functionality to the SVG icons.
 * @param {HTMLElement} videoWrapper - The wrapper element containing the video and SVG icons.
 * @param {Object} restaurant - The restaurant data associated with the video.
 */
const attachEventListeners = (videoWrapper, restaurant) => {
  const bookmark = videoWrapper.querySelector(".bookmark");
  const planet = videoWrapper.querySelector(".planet");
  const heart = videoWrapper.querySelector(".heart");
  const sound = videoWrapper.querySelector(".sound");

  bookmark.addEventListener("click", (event) => {
    changeIconColorBookmark(event);
  });
  heart.addEventListener("click", (event) => {
    changeIconColorHeart(event);
  });
  sound.addEventListener("click", (event) => {
    changeIconSound(event);
  });
  planet.addEventListener("click", () => {
    goToWebPage(restaurant.website);
  });
};

/**
 * Sets the user's location.
 * @param {{ latt: number, long: number }} data - Object containing the user's latitude and longitude coordinates.
 */
export const locationSetter = (data) => {
  userLocation = data;
};

/**
 * Renders all results based on the user input.
 * @param {Array} displayResults - Array of restaurant data to be displayed.
 * @param {HTMLElement} container - Container element where the results will be rendered.
 */
export const renderResults = (displayResults, container) => {
  // On every new render first reset container
  container.innerHTML = ``;
  if (displayResults.length === 0) {
    container.innerHTML += noResultsHTML;
  } else {
    // shuffle results and then for each create single video item
    shuffleArray(displayResults).forEach((restaurant) => {
      const videoWrapper = document.createElement("div");
      videoWrapper.classList.add("video-wrapper");
      videoWrapper.innerHTML += videoHTML(restaurant);
      container.appendChild(videoWrapper);
      // Attach event listeners
      attachEventListeners(videoWrapper, restaurant);
    });
  }
};
