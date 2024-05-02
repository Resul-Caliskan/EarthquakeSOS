import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../../constants/colors";

const NearbyPeopleModal = ({ modalVisible, nearbyPeople, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>Yakınlarımın Durumu</Text>
          <TouchableOpacity onPress={onClose}>
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
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.black,
  },
  closeButton: {
    fontSize: 16,
    color: Colors.blue,
  },
  personStatus: {
    flex:1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  personName: {
    marginRight: 10,
    color:Colors.white
  },
  personStatusText: {
    fontSize: 16,
  },
});

export default NearbyPeopleModal;
