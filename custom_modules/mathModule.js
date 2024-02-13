/**
 * Calculates the distance between the user's location and the restaurant location in miles.
 * @param {{ latt: number, long: number }} userLoc - Object containing the user's latitude and longitude coordinates.
 * @param {{ latt: number, long: number }} res - Object containing the restaurant's latitude and longitude coordinates.
 * @returns {string} - The distance between the user and the restaurant in miles, rounded to 2 decimal places.
 */
export const calculateDistance = (userLoc, res) => {
  // Earth's radius in miles
  const R = 3958.8;
  // Difference in latitude and longitude converted to radians
  const dLat = toRadians(res.latt - userLoc.latt);
  const dLon = toRadians(res.long - userLoc.long);

  // Haversine formula to calculate distance
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(userLoc.latt)) *
      Math.cos(toRadians(res.latt)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Return the distance rounded to 2 decimal places
  return distance.toFixed(2);
};

/**
 * Converts degrees to radians.
 * @param {number} degrees - The angle in degrees.
 * @returns {number} - The angle in radians.
 */
const toRadians = (degrees) => degrees * (Math.PI / 180);
