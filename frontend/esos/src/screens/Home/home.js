import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Touchable,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps"; // Harita bileşeni
import { Colors } from "../../constants/colors";
import axios from "axios";

export default function Home() {
  const [userLocation, setUserLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [nearbyPeople, setNearbyPeople] = useState([
    { name: "Ahmet", status: "Güvende" },
    { name: "Ayşe", status: "Güvende Değil" },
    { name: "Mehmet", status: "Bilinmiyor" },
  ]);

  const handleSafeButtonClick = () => {
    setConfirmModalVisible(true);
  };
  const handleEmergcy = () => {
    //Konum al
    const response = axios.post("apiurl/coordinate/send-my-coordinate", {
      coordinate: "",
      id: "",
    });
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      Alert.alert(
        "Güvende Olduğunuza Emin Misiniz?",
        "Lütfen En Yakın Toplanma Noktasına Gidin."
      );
    }
    setConfirmModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <MapView
          style={{ width: "100%", height: "100%", borderWidth: 2 }}
          initialRegion={{
            latitude: 41.0082,
            longitude: 28.9784,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: 41.0082, longitude: 28.9784 }}
            title="Güvenli Alan"
          />
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Konumunuz"
            />
          )}
        </MapView>
      </View>
      <View style={styles.buttomView}>
        <View
          style={{
            paddingHorizontal: 15,
            paddingTop: 20,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={styles.buton1}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.text}>Yakınlarımın Durumu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buton1}
            onPress={handleSafeButtonClick}
          >
            <Text style={styles.text}>Güvendeyim</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buton2} onPress={handleEmergcy}>
          <Text style={[styles.text, { fontSize: 18, textAlign: "center" }]}>
            ACİL YARDIM
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Yakınlarımın Durumu</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Kapat</Text>
            </TouchableOpacity>
          </View>
          {nearbyPeople.map((person, index) => (
            <View style={styles.personStatus} key={index}>
              <Text style={styles.personName}>{person.name}</Text>
              <Text
                style={[
                  styles.personStatusText,
                  person.status === "Güvende"
                    ? { color: "limegreen" }
                    : person.status === "Güvende Değil"
                    ? { color: "red" }
                    : { color: "white" },
                ]}
              >
                {person.status}
              </Text>
            </View>
          ))}
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.confirmModalView}>
          <Text style={styles.confirmationText}>
            Güvende Olduğunuza Emin Misiniz?
          </Text>
          <View style={styles.confirmationButtons}>
            <TouchableOpacity onPress={() => handleConfirmation(true)}>
              <Text
                style={[styles.confirmationButton, { color: Colors.limeGreen }]}
              >
                Evet
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleConfirmation(false)}>
              <Text style={[styles.confirmationButton, { color: Colors.red }]}>
                Hayır
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.darkGrey,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: StatusBar.currentHeight,
  },
  text: { color: Colors.white },
  map: {
    marginTop: StatusBar.currentHeight,
    flex: 8,
    width: "100%",
  },
  buttomView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 3,
    width: "100%",
    backgroundColor: "#1C2120",
    borderTopWidth: 2,
    borderColor: Colors.white,
  },
  buton1: {
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: "#4D4C4C",
    width: "30%",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  buton2: {
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
  modalView: {
    height: "100%",
    width: "100%",
    backgroundColor: "#1C2120",
    padding: 15,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalHeaderText: { color: Colors.white, fontSize: 20 },
  closeButton: { color: "red", fontSize: 18, fontWeight: "600" },
  personStatus: {
    flexDirection: "row",
    backgroundColor: Colors.black,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
    width: "100%",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
  },
  personName: {
    color: Colors.white,
    marginRight: 10,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  personStatusText: { fontSize: 18, fontWeight: "500", letterSpacing: 0.3 },
  confirmModalView: {
    marginTop: 60,
    margin: 50,
    width: "80%",
    height: "40%",
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  confirmationText: { color: Colors.white, fontSize: 20, marginBottom: 20 },
  confirmationButtons: {
    flexDirection: "row",
    marginTop: 30,
    width: "50%",
    justifyContent: "space-between",
  },
  confirmationButton: { fontSize: 20, fontWeight: "600" },
});
