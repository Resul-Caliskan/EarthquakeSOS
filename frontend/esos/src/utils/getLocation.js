import * as Location from "expo-location";
const getLocation = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return "Uygulamamnın doğru çalışması için lütfen konum bilgisi paylaşın";
    }

    let location = await Location.getCurrentPositionAsync({});

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error requesting location permission:", error);
  }
};

export default getLocation;
