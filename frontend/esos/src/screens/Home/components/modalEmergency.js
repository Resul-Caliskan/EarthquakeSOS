import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "../../../constants/colors";

export default function EmergencyModal({
  visible,
  closeModal,
  handleEmergency,
  loading,
  setTrue,
}) {
  const [emergencyMessage, setEmergencyMessage] = useState("");
  const [audioRecorded, setAudioRecorded] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: Colors.darkGrey,
            borderRadius: 20,
            padding: 20,
            width: "70%",
            height: "auto",
            justifyContent: "flex-start",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "gray",
          }}
        >
          <Text style={{ textAlign: "left", width: "100%", color: "white" }}>
            Acil Durum Mesajı:
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "gray",
              marginBottom: 20,
              height: 40,
              padding: 5,
              width: "100%",
              borderRadius: 10,
            }}
            onChangeText={(text) => setEmergencyMessage(text)}
          />
          <TouchableOpacity
            style={{
              marginBottom: 5,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "white",
              padding: 10,
              borderRadius: 32,
              width: 64,
              height: 64,
            }}
            onPress={() => setAudioRecorded(!audioRecorded)}
          >
            <FontAwesome name="microphone" size={24} color={"dodgerblue"} />
          </TouchableOpacity>
          <Text style={{ color: "white" }}>
            {audioRecorded ? "Kaydediliyor..." : ""}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "90%",
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              style={{ padding: 8 }}
              disabled={loading}
              onPress={closeModal}
            >
              <Text style={{ color: Colors.red, textAlign: "left" }}>
                Kapat
              </Text>
            </TouchableOpacity>
            {loading ? (
              <ActivityIndicator size="large" color="dodgerblue" />
            ) : (
              <TouchableOpacity
                style={{ padding: 8 }}
                onPress={() => {
                  handleEmergency(emergencyMessage, audioRecorded);
                  setTrue();
                }}
              >
                <Text style={{ color: Colors.limeGreen, textAlign: "right" }}>
                  Gönder
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
