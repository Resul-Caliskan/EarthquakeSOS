import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import axios from "axios";
import Geolocation from "@react-native-community/geolocation";

const apiUrl = process.env.API_URL;

const EmergencyButton = () => {
  const handleEmergency = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordinate = `${latitude},${longitude}`;

        axios
          .post(`${apiUrl}/emergency`, {
            coordinate,
            id: "",
          })
          .then((response) => {
            // Handle response as needed
          })
          .catch((error) => {
            // Handle error
          });
      },
      (error) => {
        console.error(error);
        // Handle error
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleEmergency}>
      <Text style={styles.buttonText}>ACİL YARDIM</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default EmergencyButton;
