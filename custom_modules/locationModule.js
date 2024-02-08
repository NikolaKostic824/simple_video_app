// set user location
export const setLocation = async () => {
  try {
    // get user location
    const position = await getCurrentPosition();
    return {
      latt: position.coords.latitude,
      long: position.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting location:", error);
  }
};
// function returns promise about user location
const getCurrentPosition = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
