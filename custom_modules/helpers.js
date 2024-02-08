// function to change string to camel case, used to generate id for each video
export const toCamelCase = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};
// *unction to shuffle given array, used in render results function
export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
// function to open website of specific URL
export const goToWebPage = (url) => window.open(url, "_blank");
