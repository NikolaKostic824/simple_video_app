// function to calculate distance between user location and restaurant location
// returns data in MILES
export const calculateDistance = (userLoc, res) => {
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
};

// function convert degrees into radian
const toRadians = (degrees) => degrees * (Math.PI / 180);
