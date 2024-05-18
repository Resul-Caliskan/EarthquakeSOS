import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import NavigationScreen from "./src/navigaitons/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notificationsConfig from "./src/config/notificationsConfig";
import { scheduleNotification } from "./src/utilities/pushNotifications";
import axios from "axios";
import getLocation from "./src/utils/getLocation";

export default function App() {
  useEffect(() => {
    const onNotificationConnect = () => {
      console.log("Bağladım AQ");
    };

    const onNotificationReceived = async (res) => {
      console.log("Girdi");

      try {
        await scheduleNotification(res.message);
        const { latitude, longitude } = await getLocation();
        const response = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/api/coordinate/send-my-coordinate`,
          {
            id: "65f58ecc2be8a84b7704c5ed",
            coordinate: [latitude, longitude],
          }
        );
      } catch (error) {
        console.error("Hata: " + error);
      }
    };

    notificationsConfig.on("connect", onNotificationConnect);
    notificationsConfig.on("notification", onNotificationReceived);

    // return () => {
    //   notificationsConfig.off("connect", onNotificationConnect);
    //   notificationsConfig.off("notification", onNotificationReceived);
    // };
  }, []);

  return (
    <View style={styles.container}>
      <NavigationScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
