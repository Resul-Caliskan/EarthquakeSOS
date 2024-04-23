import React, { useState } from "react";
import { View, Modal, TouchableOpacity, Text, StyleSheet } from "react-native";
import MapComponent from "./components/MapComponent";
import EmergencyButton from "./components/EmergencyButton";
import NearbyPeopleModal from "./components/NearbyPeopleModal";

const Home = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [nearbyPeople, setNearbyPeople] = useState([
    { name: "Ahmet", status: "Güvende" },
    { name: "Ayşe", status: "Güvende Değil" },
    { name: "Mehmet", status: "Bilinmiyor" },
  ]);

  return (
    <View style={styles.container}>
      <MapComponent userLocation={userLocation} />
      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Yakınlarımın Durumu</Text>
        </TouchableOpacity>
        <EmergencyButton />
      </View>
      <NearbyPeopleModal
        modalVisible={modalVisible}
        nearbyPeople={nearbyPeople}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomView: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});

export default Home;
