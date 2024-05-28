import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Navigation from "./src/navigaitons/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notificationsConfig from "./src/config/notificationsConfig";
import { scheduleNotification } from "./src/utilities/pushNotifications";
import axios from "axios";
import getLocation from "./src/utils/getLocation";

export default function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { latitude, longitude } = await getLocation();
        setLocation({ latitude, longitude });
        console.log("location", location);
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Navigation location={location} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

// // App.js
// import { StatusBar } from "expo-status-bar";
// import React, { useEffect } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import firebase from "./src/utils/firebaseConfig";

// const messaging = firebase.messaging();

// export default function App() {
//   useEffect(() => {
//     let pushToken;

//     messaging
//       .getToken()
//       .then((currentToken) => {
//         if (currentToken) {
//           console.log("FCM token> ", currentToken);
//           pushToken = currentToken;
//         } else {
//           console.log("No Token available");
//         }
//       })
//       .catch((error) => {
//         console.log("An error occurred while retrieving token. ", error);
//       });

//     messaging.onMessage((payload) => {
//       console.log("Message received. ", payload);
//       const { title, ...options } = payload.notification;
//       navigator.serviceWorker.register("firebase-messaging-sw.js");
//       function showNotification() {
//         Notification.requestPermission(function (result) {
//           if (result === "granted") {
//             navigator.serviceWorker.ready.then(function (registration) {
//               registration.showNotification(payload.notification.title, {
//                 body: payload.notification.body,
//                 tag: payload.notification.tag,
//               });
//             });
//           }
//         });
//       }
//       showNotification();
//     });
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
