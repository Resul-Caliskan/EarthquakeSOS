import { PermissionsAndroid, Platform } from "react-native";
import { PERMISSIONS, request } from "@react-native-community/permissions";

const requestLocationPermission = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Konum İzini",
        message:
          "Bu uygulamanın düzgün çalışması için konum izninize ihtiyacı var. İzin veriyor musun?",
        buttonNeutral: "Daha sonra sor",
        buttonNegative: "Hayır",
        buttonPositive: "Evet,İzin veriyorum",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Location permission granted");
      return true;
    } else {
      console.log("Location permission denied");
      return false;
    }
  } else {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (result === "granted") {
      console.log("Location permission granted");
      return true;
    } else {
      console.log("Location permission denied");
      return false;
    }
  }
};
export default  requestLocationPermission;
// Call this function when your app needs location permission
const handlePermission = async () => {
  const locationPermissionGranted = await requestLocationPermission();
  if (locationPermissionGranted) {
    // Do something when permission is granted
  } else {
    // Handle case when permission is denied
  }
};
