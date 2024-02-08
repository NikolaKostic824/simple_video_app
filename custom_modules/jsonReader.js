// function to read local JSON data file
export const readJSON = async (path) => {
  try {
    // fetch JSON
    let response = await fetch(path);
    // convert JSON
    let jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("JSON ERROR", error);
  }
};
