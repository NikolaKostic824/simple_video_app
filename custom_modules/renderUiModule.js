import { calculateDistance } from "./mathModule.js";
import { toCamelCase, shuffleArray, goToWebPage } from "./helpers.js";
import { SVG } from "./svgModule.js";

// default user location
let userLocation = {
  latt: 43.03282736873194,
  long: -87.90676045754915,
};
// function to render each video, renders different HTML based on user browser
const renderVideo = (src, poster, name) => {
  if (window.chrome) {
    return `
      <video id="id_${toCamelCase(
        name
      )}" autoplay loop muted playsinline poster="${poster}">
        <source src="${src}" type="video/mp4">
        Your browser does not support HTML5 video.
      </video>`;
  } else {
    return `
      <video data-src="${src}" id="id_${toCamelCase(
      name
    )}" autoplay loop muted playsinline poster="${poster}">
        Your browser does not support HTML5 video.
      </video>`;
  }
};
// function to change svg fill when bookmark is clicked
const changeIconColorBookmark = (event) => {
  const clickedIcon = event.currentTarget.querySelector("#iconBookmark");
  if (clickedIcon.style.fill === "yellow") {
    clickedIcon.style.fill = "none";
    clickedIcon.style.stroke = "white";
  } else {
    clickedIcon.style.fill = "yellow";
    clickedIcon.style.stroke = "yellow";
  }
  event.stopPropagation(); // Stop
};
// function to change svg when heart is clicked
const changeIconColorHeart = (event) => {
  const clickedIcon = event.currentTarget;
  if (clickedIcon.classList.contains("clicked")) {
    const oldSVG = SVG.heartSVG;
    clickedIcon.innerHTML = oldSVG;
    clickedIcon.classList.remove("clicked");
  } else {
    // Ako nema klasu "clicked", postavite novi path i dodajte klasu
    const newSVGContent = SVG.redHearthSVG;
    clickedIcon.innerHTML = newSVGContent;
    clickedIcon.classList.add("clicked");
  }

  event.stopPropagation(); // Stop
};
// function to change svg when sound is clicked
const changeIconSound = (event) => {
  const clickedIcon = event.currentTarget;
  const videoId =
    clickedIcon.parentElement.parentElement.querySelector("video").id;
  const video = document.getElementById(videoId);

  if (clickedIcon.classList.contains("muted")) {
    const oldSVG = SVG.soundSVG;
    clickedIcon.innerHTML = oldSVG;
    clickedIcon.classList.remove("muted");
    video.muted = false;
  } else {
    const newSVGContent = mutedSoundSVG;
    clickedIcon.innerHTML = newSVGContent;
    clickedIcon.classList.add("muted");
    video.muted = true;
  }

  event.stopPropagation(); // Stop
};
// HTML if there is no results to display
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
// function returns basic restaurant info
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
// function returns SVG icons holder DIV
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
// function returns detailed restaurant info and calculated distance between user and restaurant location
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
// functions returns entire video component restaurant user info, video, SVGs icons, restaurant detailed info
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
// function attach event listeners for the single video
// gives functionality to the SVGs icons
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
// userLocation setter
export const locationSetter = (data) => {
  userLocation = data;
};
// * CORE FUNCTIONALITY OF THE MODULE
// function renders all results based on the user input
export const renderResults = (displayResults, container) => {
  // On every new render first reset container
  container.innerHTML = ``;
  if (displayResults.length === 0) {
    container.innerHTML += noResultsHTML;
  } else {
    // shuffle results and than foreach create single video item
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
