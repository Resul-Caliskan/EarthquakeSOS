import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import socketBackgroundTask from "./src/backgroundTasks/socketBackgroundTask";
import NavigationScreen from "./src/navigations/navigation";

export default function App() {
  useEffect(() => {
    return () => {
      socketBackgroundTask.disconnect();
    };
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
