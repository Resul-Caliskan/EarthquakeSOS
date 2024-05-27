import React, { useState, useEffect } from "react";
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
import { Audio } from "expo-av";
import axios from "axios"; // Import axios for making HTTP requests
import getLocation from "../../../utils/getLocation";
import { showToast } from "../../../utils/toastMessage";

export default function EmergencyModal({ visible, closeModal }) {
  const [recording, setRecording] = useState();
  const [audioPath, setAudioPath] = useState("");
  const [emergencyMessage, setEmergencyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    return recording
      ? () => {
          recording.setOnRecordingStatusUpdate(null);
          recording.stopAndUnloadAsync();
        }
      : undefined;
  }, [recording]);

  const startRecording = async () => {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
      console.log("Recording started");
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const stopRecording = async () => {
    console.log("Stopping recording..");
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioPath(uri);
      setRecording(undefined);
      console.log("Recording stopped, URI:", uri);
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  const sendEmergency = async () => {
    setLoading(true);
    try {
      const { latitude, longitude } = await getLocation();
      console.log("Latitude:", latitude, "Longitude:", longitude);

      // Get current date
      const currentDate = new Date().toISOString();

      // Create FormData object to send data including file
      const formData = new FormData();
      formData.append("id", "65f58ecc2be8a84b7704c5ed");
      formData.append("coordinate", JSON.stringify([latitude, longitude]));
      formData.append(
        "message",
        emergencyMessage ? emergencyMessage : "Acil Durum Çağrısı"
      );
      formData.append("record", {
        uri: audioPath,
        name: "audio.mp3",
        type: "audio/mp3",
      });
      formData.append("date", currentDate); // Append current date

      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/api/coordinate/send-my-coordinate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Cevap: ", response.data.data);
      if (response.status === 200) {
        showToast("Acil Yardım Talebi Başarıyla Gönderildi");
        setLoading(false); // Gönderme işlemi tamamlandığında loading durumunu false olarak güncelle
      }
    } catch (error) {
      showToast(
        "HATA! Acil yardım talebi gönderilirken bir hata oluştu lütfen tekrar deneyiniz."
      );
      console.error(
        "Hata: ",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
    }
  };

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
              color: Colors.honeydew,
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
            onPress={recording ? stopRecording : startRecording}
          >
            <FontAwesome name="microphone" size={24} color={"dodgerblue"} />
          </TouchableOpacity>
          <Text style={{ color: "white" }}>
            {recording ? "Ses Kaydediliyor..." : ""}
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
              <TouchableOpacity style={{ padding: 8 }} onPress={sendEmergency}>
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
