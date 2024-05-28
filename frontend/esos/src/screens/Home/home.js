import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Touchable,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "../../constants/colors";
import axios from "axios";
import MapComponent from "./components/MapComponent";
import getLocation from "../../utils/getLocation";
import { FontAwesome } from "@expo/vector-icons";
import EmergencyModal from "./components/modalEmergency";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notificationsConfig from "../../config/notificationsConfig";
import { scheduleNotification } from "../../utilities/pushNotifications";
import { useRoute } from "@react-navigation/native";

export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [emergencyModal, setEmergencyModal] = useState(false);
  const route = useRoute();
  console.log("paarmas:", route.params);
  const { location, id } = route.params;
  console.log("home location:", location);
  console.log("id geldi mi Kardeş:", id);
  const [nearbyPeople, setNearbyPeople] = useState([
    { name: "Ahmet", status: "Güvende" },
    { name: "Ayşe", status: "Güvende Değil" },
    { name: "Mehmet", status: "Bilinmiyor" },
  ]);
  const [emergencyMessage, setEmergencyMessage] = useState("Acil Yardım");
  const [audioRecorded, setAudioRecorded] = useState(false);

  useEffect(() => {
    const onNotificationConnect = () => {
      console.log("Bağladım");
    };

    const onNotificationReceived = async (res) => {
      console.log("Girdi");

      try {
        const currentDate = new Date().toISOString();
        await scheduleNotification(res.message);
        const { latitude, longitude } = await getLocation();
        const response = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/api/coordinate/send-my-coordinate`,
          {
            id: id,
            coordinate: JSON.stringify([latitude, longitude]),
            date: currentDate,
            message:
              "Deprem Oldu! Kişi Konumu Bilgisi Sistem tarafından Paylaşıldı",
          }
        );
      } catch (error) {
        console.error("Hata: " + error);
      }
    };

    notificationsConfig.on("connect", onNotificationConnect);
    notificationsConfig.on("notification", onNotificationReceived);

    return () => {
      notificationsConfig.off("connect", onNotificationConnect);
      notificationsConfig.off("notification", onNotificationReceived);
    };
  }, []);

  const handleSafeButtonClick = () => {
    setConfirmModalVisible(true);
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
        <MapComponent userLocation={location} />
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
            onPress={() => navigation.navigate("health")}
          >
            <Text style={styles.text}>Sağlık Bilgilerim</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.buton2}
          onPress={() => setEmergencyModal(true)}
        >
          <Text style={[styles.text, { fontSize: 18, textAlign: "center" }]}>
            ACİL YARDIM
          </Text>
        </TouchableOpacity>
      </View>
      <EmergencyModal
        visible={emergencyModal}
        id={id}
        closeModal={() => setEmergencyModal(false)}
      />
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
      {/* <Modal
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
            <TouchableOpacity
              onPress={() => {
                handleConfirmation(true);
              }}
            >
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
      </Modal> */}
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
