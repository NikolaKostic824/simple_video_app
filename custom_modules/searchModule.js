// Timer related variables
let typingTimer;
const doneTypingInterval = 500; // 500ms

/**
 * Sets up a timer for handling search input. After a certain amount of time, updates the result list and re-renders it.
 * @param {Array} data - Array of restaurant data to be searched.
 * @param {Function} renderFnc - Function to render the search results.
 * @param {HTMLElement} container - Container element where the results will be rendered.
 */
export const setupSearchTimer = (data, renderFnc, container) => {
  document.getElementById("search_input").addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(async () => {
      const displayResults = await searchRestaurants(data);
      renderFnc(displayResults, container);
    }, doneTypingInterval);
  });
};

/**
 * Uses user input to filter restaurant data and returns the filtered results.
 * @param {Array} data - Array of restaurant data to be filtered.
 * @returns {Array} - Filtered array of restaurant data based on the user input.
 */
export const searchRestaurants = async (data) => {
  // Get search input
  const searchInput = document.getElementById("search_input").value;
  let displayResults = [];
  // Filter data based on the search input
  if (searchInput !== "") {
    displayResults = data.filter((restaurant) =>
      restaurant.city.toLowerCase().includes(searchInput.toLowerCase())
    );
  }
  return displayResults;
};
