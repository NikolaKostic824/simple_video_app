/**
 * Function to change string to camel case, used to generate id for each video.
 * @param {string} name - The input string to convert to camel case.
 * @returns {string} - The string converted to camel case.
 */
export const toCamelCase = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};

/**
 * Function to shuffle given array, used in render results function.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Function to open website of specific URL.
 * @param {string} url - The URL of the website to open.
 */
export const goToWebPage = (url) => window.open(url, "_blank");
