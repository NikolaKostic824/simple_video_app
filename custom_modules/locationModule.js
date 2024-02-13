/**
 * Sets the user location asynchronously.
 * @returns {Promise<{ latt: number, long: number }>} - A promise that resolves to an object containing latitude and longitude coordinates.
 */
export const setLocation = async () => {
  try {
    // Get the user's current position
    const position = await getCurrentPosition();
    // Return an object with latitude and longitude coordinates
    return {
      latt: position.coords.latitude,
      long: position.coords.longitude,
    };
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error getting location:", error);
  }
};

/**
 * Function that returns a promise about the user's location.
 * @returns {Promise<Position>} - A promise that resolves to a Position object representing the user's current location.
 */
const getCurrentPosition = async () => {
  // Create a promise that resolves when the user's current position is retrieved successfully
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
