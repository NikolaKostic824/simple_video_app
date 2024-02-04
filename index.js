// **! VARIABLES ** //

// * main container for rendering video component
let appContainer = document.querySelector(".content");

// * timer related variables
let typingTimer;
const doneTypingInterval = 500; // 500ms

// * array of results based on search
let displayResults = [];

// * placeholder for user location. Default location is SH Milwaukee
let userLocation = {
  latt: 43.03282736873194,
  long: -87.90676045754915,
};

// * placeholder for JSON data
let data = [];

// **! END VARIABLES ** //

// **! EVENT LISTENERES AND WINDOWS ** //

// * on load get user location and set list
window.onload = async () => {
  if ("geolocation" in navigator) {
    try {
      const position = await getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // * Set user location
      userLocation = {
        latt: latitude,
        long: longitude,
      };
    } catch (error) {
      console.error("Error getting location:", error);
    }
  } else {
    console.error("Geolocation is not available in this browser.");
  }
  // * Read local JSON
  data = await readJSON();

  // * Set aviable restaurants
  searchRestaurants();
};

// * function returns promise about user location
async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// * add load event for video
window.addEventListener("load", videoScroll);

// * attach event handler to scroll video
window.addEventListener("scroll", videoScroll);

// * attach event handler to scroll
window.addEventListener("scroll", lazyLoadAndAutoPlayVideo);

// * initial load setup
lazyLoadAndAutoPlayVideo();

// * typing Timer after certan amount of time udpate result list and re-render
document.getElementById("search_input").addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(searchRestaurants, doneTypingInterval);
});

// * add event listeber when user open webiste link 
document.addEventListener("visibilitychange", onNewTabOpenPauseVideo);

// **! END EVENT LISTENERES AND WINDOWS ** //

// **! JSON FUNCTIONS **//

// * function to read local JSON data file
async function readJSON() {
  try {
    let response = await fetch("../assets/data-restaurants.json");
    let jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("JSON ERROR", error);
  }
}
// **! END  JSON FUNCTIONS **//

// **! LOCATION FUNCTIONS **//

// * function to calculate distance between user and restaurant
function calculateDistance(userLoc, res) {
  const R = 3958.8;
  const dLat = toRadians(res.latt - userLoc.latt);
  const dLon = toRadians(res.long - userLoc.long);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(userLoc.latt)) *
      Math.cos(toRadians(res.latt)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance.toFixed(2);
}

// * convert degreees into radinas
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// **! END LOCATION FUNCTIONS ** //

// **! LIST RENDER AND SEARCH FUNCTIONS ** //

// * search Logic
function searchRestaurants() {
  // Get Search input
  const searchInput = document.getElementById("search_input").value;
  // * Restaurant results after location search
  if (searchInput != "") {
    displayResults = data.filter((restaurant) =>
      restaurant.city.toLowerCase().includes(searchInput.toLowerCase())
    );
  } else {
    displayResults = [];
  }
  // * rerender content div
  renderResults();
}

// * function to change string to camel case, used to generate id for each video 
function toCamelCase(name) {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

// * function to render each video, renderes diffrent HTML absed on user browser 
function renderVideo(src, poster, name) {
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
}

// * function to shuffle given array, used in render results function
function shuffleArray(array) { 
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
};

// * for each restaurant in result display video componnent
function renderResults() {
  // On every new render first reset container
  appContainer.innerHTML = ``;

  if (displayResults.length === 0) {
    appContainer.innerHTML += `
    <div class="noRestaurant">
      <div class="notFoundImg">
        <img clas="firstImg" src="assets/no_result.svg" alt="no restaurant found icon" width="100" height="100">
      </div>
      
      <h2>Oops!</h2> area.</h2>
      <p>Try broadening your search criteria</p>
      <p>No restaurants found <br />in this<br /> or check back later for updates.</p>
    </div>`;
  } else {
    shuffleArray(displayResults).forEach((restaurant) => {
      const videoWrapper = document.createElement("div");
      videoWrapper.classList.add("video-wrapper");
      videoWrapper.innerHTML += `
      <div class="user-info">
          <img class="user-image" src="${
            restaurant.restaurantImage
          }" alt="User Image">
          <div class="user-details">
            <div class="user-title">${restaurant.restaurantName}</div>
            <div class="user-subtitle">${restaurant.type}</div>
          </div>
      </div>
      
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
    
            <div class="icons-overlay">
            <div class="blurred-circle" id="Bookmark" onclick="changeIconColorBookmark(event)">
                <span class="icon">
                <svg  width="20" height="27" viewBox="0 0 20 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path id="iconBookmark" d="M15.5362 1.99778H4.45932C3.72488 1.99778 3.02051 2.27873 2.50118 2.77883C1.98185 3.27893 1.69009 3.9572 1.69009 4.66445V25.9978L9.99779 21.9978L18.3055 25.9978V4.66445C18.3055 3.9572 18.0137 3.27893 17.4944 2.77883C16.9751 2.27873 16.2707 1.99778 15.5362 1.99778Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                </span>
            </div>
            
            <div id="iconHeart" class="blurred-circle" onclick="changeIconColorHeart(event)">
                <span class="icon" >
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 25 23" fill="none">
                  <path d="M18.3549 0.997778C16.1424 0.997778 14.2053 2.01552 12.9978 3.73582C11.7903 2.01552 9.85313 0.997778 7.64063 0.997778C5.87944 0.999901 4.19096 1.74923 2.94561 3.08138C1.70027 4.41352 0.999757 6.21969 0.997772 8.10362C0.997772 16.1263 12.1181 22.6202 12.5917 22.8884C12.7165 22.9602 12.856 22.9978 12.9978 22.9978C13.1395 22.9978 13.279 22.9602 13.4038 22.8884C13.8774 22.6202 24.9978 16.1263 24.9978 8.10362C24.9958 6.21969 24.2953 4.41352 23.0499 3.08138C21.8046 1.74923 20.1161 0.999901 18.3549 0.997778ZM12.9978 21.0317C11.0413 19.8122 2.71206 14.2571 2.71206 8.10362C2.71376 6.70594 3.23356 5.36602 4.15748 4.37771C5.0814 3.3894 6.33401 2.83336 7.64063 2.83154C9.72456 2.83154 11.4742 4.01891 12.2049 5.92602C12.2695 6.09419 12.3793 6.23802 12.5205 6.33925C12.6617 6.44047 12.8278 6.49452 12.9978 6.49452C13.1677 6.49452 13.3338 6.44047 13.475 6.33925C13.6162 6.23802 13.7261 6.09419 13.7906 5.92602C14.5213 4.01547 16.271 2.83154 18.3549 2.83154C19.6615 2.83336 20.9141 3.3894 21.8381 4.37771C22.762 5.36602 23.2818 6.70594 23.2835 8.10362C23.2835 14.2479 14.9521 19.8111 12.9978 21.0317Z" fill="white"/>
                </svg>
                </span>
            </div>
            <div class="blurred-circle" onclick="goToRestaurantWebPage('${
              restaurant.website
            }')">
                <span class="icon">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path id="iconGlobe" d="M13 0.5C10.5277 0.5 8.11099 1.23311 6.05538 2.60663C3.99976 3.98015 2.39761 5.93238 1.45151 8.21645C0.505416 10.5005 0.257874 13.0139 0.74019 15.4386C1.2225 17.8634 2.41301 20.0907 4.16117 21.8388C5.90933 23.587 8.13661 24.7775 10.5614 25.2598C12.9861 25.7421 15.4995 25.4946 17.7835 24.5485C20.0676 23.6024 22.0199 22.0002 23.3934 19.9446C24.7669 17.889 25.5 15.4723 25.5 13C25.4965 9.68587 24.1784 6.50848 21.835 4.16503C19.4915 1.82158 16.3141 0.5035 13 0.5ZM9.83053 17.8077H16.1695C15.524 20.012 14.4423 21.9988 13 23.5637C11.5577 21.9988 10.476 20.012 9.83053 17.8077ZM9.39423 15.8846C9.07533 13.9748 9.07533 12.0252 9.39423 10.1154H16.6058C16.9247 12.0252 16.9247 13.9748 16.6058 15.8846H9.39423ZM2.42308 13C2.42225 12.0246 2.55695 11.0537 2.82332 10.1154H7.44592C7.15906 12.0278 7.15906 13.9722 7.44592 15.8846H2.82332C2.55695 14.9463 2.42225 13.9754 2.42308 13ZM16.1695 8.19231H9.83053C10.476 5.98798 11.5577 4.0012 13 2.4363C14.4423 4.0012 15.524 5.98798 16.1695 8.19231ZM18.5541 10.1154H23.1767C23.7103 12.0014 23.7103 13.9986 23.1767 15.8846H18.5541C18.8409 13.9722 18.8409 12.0278 18.5541 10.1154ZM22.4195 8.19231H18.1611C17.6704 6.26143 16.8463 4.43106 15.726 2.78365C17.1573 3.16829 18.4922 3.84822 19.645 4.77972C20.7978 5.71122 21.7429 6.87367 22.4195 8.19231ZM10.274 2.78365C9.15372 4.43106 8.32965 6.26143 7.83895 8.19231H3.58053C4.25713 6.87367 5.2022 5.71122 6.35498 4.77972C7.50776 3.84822 8.84273 3.16829 10.274 2.78365ZM3.58053 17.8077H7.83895C8.32965 19.7386 9.15372 21.5689 10.274 23.2163C8.84273 22.8317 7.50776 22.1518 6.35498 21.2203C5.2022 20.2888 4.25713 19.1263 3.58053 17.8077ZM15.726 23.2163C16.8463 21.5689 17.6704 19.7386 18.1611 17.8077H22.4195C21.7429 19.1263 20.7978 20.2888 19.645 21.2203C18.4922 22.1518 17.1573 22.8317 15.726 23.2163Z" fill="white"/>
                </svg>
                </span>
            </div>

            <div id="soundIcon" class="blurred-circle muted" onclick="changeIconSound(event)">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="24" viewBox="0 0 27 24" fill="none">
                <path d="M22.9978 13.5642L20.8719 15.6901C20.6668 15.8952 20.4057 15.9978 20.0887 15.9978C19.7717 15.9978 19.5106 15.8952 19.3055 15.6901C19.1004 15.485 18.9978 15.2239 18.9978 14.9069C18.9978 14.5899 19.1004 14.3288 19.3055 14.1237L21.4314 11.9978L19.3055 9.87191C19.1004 9.66679 18.9978 9.40571 18.9978 9.0887C18.9978 8.77168 19.1004 8.51061 19.3055 8.30548C19.5106 8.10035 19.7717 7.99779 20.0887 7.99779C20.4057 7.99779 20.6668 8.10035 20.8719 8.30548L22.9978 10.4314L25.1237 8.30548C25.3288 8.10035 25.5899 7.99779 25.9069 7.99779C26.2239 7.99779 26.485 8.10035 26.6901 8.30548C26.8952 8.51061 26.9978 8.77168 26.9978 9.0887C26.9978 9.40571 26.8952 9.66679 26.6901 9.87191L24.5642 11.9978L26.6901 14.1237C26.8952 14.3288 26.9978 14.5899 26.9978 14.9069C26.9978 15.2239 26.8952 15.485 26.6901 15.6901C26.485 15.8952 26.2239 15.9978 25.9069 15.9978C25.5899 15.9978 25.3288 15.8952 25.1237 15.6901L22.9978 13.5642Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0954 3.06422L9.36282 7.27956C9.35507 7.28831 9.34717 7.29692 9.33912 7.30539C9.13217 7.52322 8.88326 7.69687 8.60739 7.81588C8.3315 7.9349 8.03438 7.9968 7.73393 7.99786L7.73038 7.99787H3.24782C3.14675 7.99787 2.9978 8.09528 2.9978 8.29789V15.6967C2.9978 15.9012 3.14736 15.998 3.24782 15.998H7.72337C8.02875 15.9989 8.33068 16.0627 8.61035 16.1853C8.89001 16.308 9.14145 16.4869 9.34899 16.7109L9.36332 16.7267L13.0895 20.9252C13.1389 20.9757 13.179 20.9896 13.2055 20.9947C13.2389 21.0011 13.2822 20.9984 13.3293 20.9785C13.3764 20.9586 13.4178 20.9251 13.4468 20.8827C13.4731 20.8441 13.498 20.7857 13.498 20.6943V3.30158C13.498 3.21134 13.4735 3.15305 13.4472 3.11421C13.4183 3.07153 13.3771 3.03791 13.3303 3.01773C13.2836 2.99757 13.2405 2.99457 13.2072 3.00056C13.1814 3.00521 13.143 3.01807 13.0954 3.06422ZM11.6429 1.68889C13.1151 0.156001 15.498 1.33071 15.498 3.30158V20.6943C15.498 22.681 13.0844 23.8472 11.6228 22.2851C11.6168 22.2787 11.6108 22.2722 11.605 22.2656L7.87737 18.0655C7.85728 18.045 7.83343 18.0285 7.8071 18.0169C7.77906 18.0046 7.74881 17.9982 7.7182 17.998H3.24782C1.96826 17.998 0.997803 16.9298 0.997803 15.6967V8.29789C0.997803 7.06548 1.96887 5.99787 3.24782 5.99787H7.72788C7.75792 5.99762 7.78759 5.99137 7.81516 5.97948C7.83984 5.96883 7.86239 5.95386 7.88174 5.93531L11.6155 1.71863C11.6245 1.70853 11.6336 1.69862 11.6429 1.68889Z" fill="white"/>
               </svg>
              </span>
            </div>


          </div>
        </div>
    
      <div class="map-info">
          <div>
            <span class="map-icon"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
            <path d="M11.596 11.5604L8.06099 15.0964C7.92169 15.2358 7.75629 15.3464 7.57423 15.4219C7.39218 15.4973 7.19705 15.5361 6.99999 15.5361C6.80292 15.5361 6.60779 15.4973 6.42574 15.4219C6.24369 15.3464 6.07829 15.2358 5.93899 15.0964L2.40399 11.5604C1.80037 10.9569 1.32154 10.2404 0.994833 9.45175C0.66813 8.66314 0.499955 7.8179 0.499908 6.9643C0.499862 6.1107 0.667946 5.26544 0.994562 4.4768C1.32118 3.68816 1.79993 2.97157 2.40349 2.36795C3.00704 1.76433 3.72358 1.28549 4.51219 0.958792C5.3008 0.632089 6.14603 0.463914 6.99963 0.463867C7.85324 0.463821 8.69849 0.631904 9.48713 0.958521C10.2758 1.28514 10.9924 1.76389 11.596 2.36745C12.1997 2.97104 12.6785 3.68763 13.0052 4.4763C13.3319 5.26498 13.5001 6.11028 13.5001 6.96395C13.5001 7.81761 13.3319 8.66292 13.0052 9.45159C12.6785 10.2403 12.1997 10.9569 11.596 11.5604ZM10.536 3.42845C9.59818 2.49064 8.32624 1.96279 6.99999 1.96279C5.67373 1.96279 4.40179 2.48964 3.46399 3.42745C2.52618 4.36525 1.99933 5.63719 1.99933 6.96345C1.99933 8.2897 2.52618 9.56164 3.46399 10.4994L6.99999 14.0344L10.536 10.5004C11.0004 10.0361 11.3688 9.48488 11.6202 8.87817C11.8715 8.27145 12.0009 7.62117 12.0009 6.96445C12.0009 6.30773 11.8715 5.65744 11.6202 5.05072C11.3688 4.44401 11.0004 3.89276 10.536 3.42845ZM6.99999 8.96445C6.73365 8.97047 6.46879 8.92322 6.22096 8.82547C5.97314 8.72773 5.74733 8.58146 5.55681 8.39524C5.3663 8.20903 5.2149 7.98663 5.11151 7.7411C5.00813 7.49557 4.95484 7.23186 4.95477 6.96546C4.95471 6.69905 5.00786 6.43532 5.11113 6.18973C5.21439 5.94415 5.36567 5.72168 5.5561 5.53537C5.74653 5.34906 5.97225 5.20268 6.22003 5.10481C6.46781 5.00694 6.73265 4.95956 6.99899 4.96545C7.52155 4.977 8.01882 5.19267 8.38436 5.56629C8.74989 5.9399 8.95464 6.44177 8.95477 6.96446C8.9549 7.48715 8.75041 7.98912 8.38506 8.36291C8.01971 8.73671 7.52254 8.95263 6.99999 8.96445Z" fill="white"/>
            </svg></i></span>
            <span class="distance">Distance</span>
            <span class="bold-distance">${calculateDistance(
              userLocation,
              restaurant
            )} mi</span>

          </div>
          <p class="info-text">${
            restaurant.description != "NULL" ? restaurant.description : ""
          }</p>
      </div>
      `;

      appContainer.appendChild(videoWrapper);
    });
  }
}

// * function to change svg fill when bookmark is clicked
function changeIconColorBookmark(event) {
  const clickedIcon = event.currentTarget.querySelector("#iconBookmark");
  if (clickedIcon.style.fill === "yellow") {
    clickedIcon.style.fill = "none";
    clickedIcon.style.stroke = "white";
  } else {
    clickedIcon.style.fill = "yellow";
    clickedIcon.style.stroke = "yellow";
  }
  event.stopPropagation(); // Stop
}

// * function to change svg when heart is clicked
function changeIconColorHeart(event) {
  const clickedIcon = event.currentTarget;
  if (clickedIcon.classList.contains("clicked")) {
    const oldSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 25 23" fill="none">
    <path d="M18.3549 0.997778C16.1424 0.997778 14.2053 2.01552 12.9978 3.73582C11.7903 2.01552 9.85313 0.997778 7.64063 0.997778C5.87944 0.999901 4.19096 1.74923 2.94561 3.08138C1.70027 4.41352 0.999757 6.21969 0.997772 8.10362C0.997772 16.1263 12.1181 22.6202 12.5917 22.8884C12.7165 22.9602 12.856 22.9978 12.9978 22.9978C13.1395 22.9978 13.279 22.9602 13.4038 22.8884C13.8774 22.6202 24.9978 16.1263 24.9978 8.10362C24.9958 6.21969 24.2953 4.41352 23.0499 3.08138C21.8046 1.74923 20.1161 0.999901 18.3549 0.997778ZM12.9978 21.0317C11.0413 19.8122 2.71206 14.2571 2.71206 8.10362C2.71376 6.70594 3.23356 5.36602 4.15748 4.37771C5.0814 3.3894 6.33401 2.83336 7.64063 2.83154C9.72456 2.83154 11.4742 4.01891 12.2049 5.92602C12.2695 6.09419 12.3793 6.23802 12.5205 6.33925C12.6617 6.44047 12.8278 6.49452 12.9978 6.49452C13.1677 6.49452 13.3338 6.44047 13.475 6.33925C13.6162 6.23802 13.7261 6.09419 13.7906 5.92602C14.5213 4.01547 16.271 2.83154 18.3549 2.83154C19.6615 2.83336 20.9141 3.3894 21.8381 4.37771C22.762 5.36602 23.2818 6.70594 23.2835 8.10362C23.2835 14.2479 14.9521 19.8111 12.9978 21.0317Z" fill="white"/>
  </svg>`;
    clickedIcon.innerHTML = oldSVG;
    clickedIcon.classList.remove("clicked");
  } else {
    // Ako nema klasu "clicked", postavite novi path i dodajte klasu
    const newSVGContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 22" fill="none">
    <path d="M12.4773 21.3692L12.4698 21.3647L12.4413 21.3497C11.8494 21.0277 11.2681 20.6865 10.6983 20.3267C9.33985 19.472 8.04543 18.5195 6.8253 17.4767C4.0653 15.0962 0.997803 11.5247 0.997803 7.24674C0.997935 5.85093 1.43078 4.48948 2.23673 3.34987C3.04268 2.21025 4.1821 1.34852 5.4981 0.883308C6.81411 0.418101 8.24197 0.372306 9.58507 0.752229C10.9282 1.13215 12.1205 1.91911 12.9978 3.00474C13.8751 1.91911 15.0674 1.13215 16.4105 0.752229C17.7536 0.372306 19.1815 0.418101 20.4975 0.883308C21.8135 1.34852 22.9529 2.21025 23.7589 3.34987C24.5648 4.48948 24.9977 5.85093 24.9978 7.24674C24.9978 11.5247 21.9318 15.0962 19.1703 17.4767C17.4368 18.9579 15.5548 20.2558 13.5543 21.3497L13.5258 21.3647L13.5183 21.3692H13.5153C13.3559 21.4537 13.1784 21.4979 12.998 21.4982C12.8176 21.4985 12.6399 21.4547 12.4803 21.3707L12.4773 21.3692Z" fill="#F03A49"/>
  </svg>
        `;
    clickedIcon.innerHTML = newSVGContent;
    clickedIcon.classList.add("clicked");
  }

  event.stopPropagation(); // Stop
}

// * function to change svg when sound is clicked
function changeIconSound(event) {
  const clickedIcon = event.currentTarget;

  const videoId =
    clickedIcon.parentElement.parentElement.querySelector("video").id;
  const video = document.getElementById(videoId);

  if (clickedIcon.classList.contains("muted")) {
    const oldSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="23" viewBox="0 0 26 23" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.6202 3.07898L8.73857 7.29408C8.73064 7.3027 8.72255 7.31117 8.71432 7.31951C8.50085 7.53556 8.2463 7.70561 7.96715 7.82141C7.68805 7.93718 7.38886 7.99689 7.08728 7.99792L7.08387 7.99792H2.42207C2.25682 7.99792 2.12207 8.13265 2.12207 8.29794V15.6968C2.12207 15.864 2.25744 15.9981 2.42207 15.9981H7.07634C7.38285 15.9989 7.6869 16.0604 7.96989 16.1798C8.25295 16.2991 8.5102 16.4744 8.72442 16.6967L8.7391 16.7123L12.6141 20.9107C12.8019 21.0936 13.1221 20.9629 13.1221 20.6944V3.30162C13.1221 3.03582 12.8087 2.90533 12.6202 3.07898ZM11.1954 1.67494C12.6462 0.222354 15.1221 1.2545 15.1221 3.30162V20.6944C15.1221 22.7578 12.6154 23.7798 11.1746 22.2993C11.1685 22.293 11.1624 22.2866 11.1564 22.2801L7.27949 18.0797C7.25669 18.0573 7.2276 18.0373 7.19278 18.0226C7.15577 18.007 7.11438 17.9983 7.0715 17.9981H2.42207C1.1515 17.9981 0.12207 16.9671 0.12207 15.6968V8.29794C0.12207 7.02821 1.15212 5.99792 2.42207 5.99792H7.08157C7.12366 5.99763 7.16433 5.98919 7.20083 5.97404C7.23367 5.96042 7.2615 5.94209 7.28383 5.92138L11.1674 1.7042C11.1765 1.69426 11.1859 1.6845 11.1954 1.67494ZM20.2369 2.65176C20.6104 2.24494 21.243 2.21795 21.6499 2.59147C27.2613 7.74363 27.3031 16.4393 21.6452 21.5691C21.2361 21.9401 20.6037 21.9092 20.2327 21.5C19.8617 21.0908 19.8927 20.4584 20.3018 20.0875C25.0752 15.7597 25.0546 8.43265 20.2972 4.06469C19.8904 3.69116 19.8634 3.05858 20.2369 2.65176ZM18.7072 6.83431C19.1427 6.49472 19.7711 6.57251 20.1107 7.00805C21.1545 8.34678 21.6217 10.2193 21.6217 11.998C21.6217 13.7767 21.1545 15.6492 20.1107 16.9879C19.7711 17.4235 19.1427 17.5013 18.7072 17.1617C18.2716 16.8221 18.1939 16.1937 18.5334 15.7582C19.2225 14.8744 19.6217 13.4831 19.6217 11.998C19.6217 10.5129 19.2225 9.12161 18.5334 8.23781C18.1939 7.80227 18.2716 7.1739 18.7072 6.83431Z" fill="white"/>
  </svg>`;
    clickedIcon.innerHTML = oldSVG;
    clickedIcon.classList.remove("muted");
    video.muted = false;
  } else {
    const newSVGContent = `<svg xmlns="http://www.w3.org/2000/svg" width="27" height="24" viewBox="0 0 27 24" fill="none">
    <path d="M22.9978 13.5642L20.8719 15.6901C20.6668 15.8952 20.4057 15.9978 20.0887 15.9978C19.7717 15.9978 19.5106 15.8952 19.3055 15.6901C19.1004 15.485 18.9978 15.2239 18.9978 14.9069C18.9978 14.5899 19.1004 14.3288 19.3055 14.1237L21.4314 11.9978L19.3055 9.87191C19.1004 9.66679 18.9978 9.40571 18.9978 9.0887C18.9978 8.77168 19.1004 8.51061 19.3055 8.30548C19.5106 8.10035 19.7717 7.99779 20.0887 7.99779C20.4057 7.99779 20.6668 8.10035 20.8719 8.30548L22.9978 10.4314L25.1237 8.30548C25.3288 8.10035 25.5899 7.99779 25.9069 7.99779C26.2239 7.99779 26.485 8.10035 26.6901 8.30548C26.8952 8.51061 26.9978 8.77168 26.9978 9.0887C26.9978 9.40571 26.8952 9.66679 26.6901 9.87191L24.5642 11.9978L26.6901 14.1237C26.8952 14.3288 26.9978 14.5899 26.9978 14.9069C26.9978 15.2239 26.8952 15.485 26.6901 15.6901C26.485 15.8952 26.2239 15.9978 25.9069 15.9978C25.5899 15.9978 25.3288 15.8952 25.1237 15.6901L22.9978 13.5642Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0954 3.06422L9.36282 7.27956C9.35507 7.28831 9.34717 7.29692 9.33912 7.30539C9.13217 7.52322 8.88326 7.69687 8.60739 7.81588C8.3315 7.9349 8.03438 7.9968 7.73393 7.99786L7.73038 7.99787H3.24782C3.14675 7.99787 2.9978 8.09528 2.9978 8.29789V15.6967C2.9978 15.9012 3.14736 15.998 3.24782 15.998H7.72337C8.02875 15.9989 8.33068 16.0627 8.61035 16.1853C8.89001 16.308 9.14145 16.4869 9.34899 16.7109L9.36332 16.7267L13.0895 20.9252C13.1389 20.9757 13.179 20.9896 13.2055 20.9947C13.2389 21.0011 13.2822 20.9984 13.3293 20.9785C13.3764 20.9586 13.4178 20.9251 13.4468 20.8827C13.4731 20.8441 13.498 20.7857 13.498 20.6943V3.30158C13.498 3.21134 13.4735 3.15305 13.4472 3.11421C13.4183 3.07153 13.3771 3.03791 13.3303 3.01773C13.2836 2.99757 13.2405 2.99457 13.2072 3.00056C13.1814 3.00521 13.143 3.01807 13.0954 3.06422ZM11.6429 1.68889C13.1151 0.156001 15.498 1.33071 15.498 3.30158V20.6943C15.498 22.681 13.0844 23.8472 11.6228 22.2851C11.6168 22.2787 11.6108 22.2722 11.605 22.2656L7.87737 18.0655C7.85728 18.045 7.83343 18.0285 7.8071 18.0169C7.77906 18.0046 7.74881 17.9982 7.7182 17.998H3.24782C1.96826 17.998 0.997803 16.9298 0.997803 15.6967V8.29789C0.997803 7.06548 1.96887 5.99787 3.24782 5.99787H7.72788C7.75792 5.99762 7.78759 5.99137 7.81516 5.97948C7.83984 5.96883 7.86239 5.95386 7.88174 5.93531L11.6155 1.71863C11.6245 1.70853 11.6336 1.69862 11.6429 1.68889Z" fill="white"/>
  </svg>`;
    clickedIcon.innerHTML = newSVGContent;
    clickedIcon.classList.add("muted");
    video.muted = true;
  }

  event.stopPropagation(); // Stop
}

// * function to open website of specific restaurant
function goToRestaurantWebPage(url) {
  window.open(url, "_blank");
}

// **! END LIST RENDER FUNCTIONS ** //

// **! VIDEO FUNCTIONS ** //

// * when user open webiste link pause all videos
function onNewTabOpenPauseVideo() {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => video.pause());
}

// * listener for scroll
function videoScroll() {
  if (document.querySelectorAll("video[autoplay]").length > 0) {
    let windowHeight = window.innerHeight,
      videoEl = document.querySelectorAll("video[autoplay]");

    for (let i = 0; i < videoEl.length; i++) {
      let thisVideoEl = videoEl[i],
        videoHeight = thisVideoEl.clientHeight,
        videoClientRect = thisVideoEl.getBoundingClientRect().top;

      if (
        videoClientRect <= windowHeight - videoHeight * 1.2 &&
        videoClientRect >= 0 - videoHeight * 0.5
      ) {
        // Check if this video has sound enabled
        //thisVideoEl.muted = false;
        thisVideoEl.play();
      } else {
        thisVideoEl.pause();
      }
    }
  }
}

// * function to check if video is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// * lazy load video and auto play if video is viewport
function lazyLoadAndAutoPlayVideo() {
  const videos = document.querySelectorAll("video[data-src]");
  videos.forEach((video) => {
    if (isElementInViewport(video)) {
      video.src = video.getAttribute("data-src");
      video.removeAttribute("data-src");
      video.setAttribute("autoplay", "true");
      video.setAttribute("playsinline", "true"); 

      video.play();
    }
  });
}

// **! END VIDEO FUNCTIONS ** //