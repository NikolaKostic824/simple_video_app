// timer related variables
let typingTimer;
const doneTypingInterval = 500; // 500ms

// typing Timer after certain amount of time update result list and re-render
export const setupSearchTimer = (data, renderFnc, container) => {
  document.getElementById("search_input").addEventListener("input", () => {
    console.log("RUUUN");
    clearTimeout(typingTimer);
    typingTimer = setTimeout(
      async () => {
        console.log(data);
        const displayResults = await searchRestaurants(data);
        renderFnc(displayResults, container);
      },

      doneTypingInterval
    );
  });
};
// function uses user input and returns data to display
export const searchRestaurants = async (data) => {
  // Get Search input
  const searchInput = document.getElementById("search_input").value;
  let displayResults = [];
  // Restaurant results after location search
  if (searchInput != "") {
    // filter all data in order to display correct results
    displayResults = data.filter((restaurant) =>
      restaurant.city.toLowerCase().includes(searchInput.toLowerCase())
    );
  } else {
    // if user input is empty return data
    displayResults = [];
  }
  return displayResults;
};
