import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import axios from "axios";
import { Colors } from "../../../constants/colors";
// import Geolocation from "@react-native-community/geolocation";

const apiUrl = process.env.API_URL;

const EmergencyButton = () => {
  const handleEmergency = () => {
    // Geolocation.getCurrentPosition(
    //   (position) => {
    //     const { latitude, longitude } = position.coords;
    //     const coordinate = `${latitude},${longitude}`;

    //     axios
    //       .post(`${apiUrl}/emergency`, {
    //         coordinate,
    //         id: "",
    //       })
    //       .then((response) => {
    //         // Handle response as needed
    //       })
    //       .catch((error) => {
    //         // Handle error
    //       });
    //   },
    //   (error) => {
    //     console.error(error);
    //     // Handle error
    //   },
    //   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    // );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleEmergency}>
      <Text style={styles.buttonText}>ACİL YARDIM</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.red,
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: Colors.white,
    marginBottom: 10,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default EmergencyButton;
