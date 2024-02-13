/**
 * Function to read local JSON data file asynchronously.
 * @param {string} path - The path to the local JSON data file.
 * @returns {Promise<object>} - A promise that resolves to the JSON data object.
 */
export const readJSON = async (path) => {
  try {
    // Fetch JSON data from the specified path
    let response = await fetch(path);
    // Convert the fetched JSON data to JavaScript object
    let jsonData = await response.json();
    // Return the JSON data object
    return jsonData;
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("JSON ERROR", error);
  }
};
