// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   ActivityIndicator,
// } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
// import { Colors } from "../../../constants/colors";
// import { Audio } from "expo-av";
// import axios from "axios"; // Import axios for making HTTP requests
// import getLocation from "../../../utils/getLocation";
// import { showToast } from "../../../utils/toastMessage";

// export default function EmergencyModal({
//   visible,
//   id,
//   closeModal,
// }) {
//   const [recording, setRecording] = useState();
//   const [audioPath, setAudioPath] = useState("");
//   const [emergencyMessage, setEmergencyMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   useEffect(() => {
//     return recording
//       ? () => {
//           recording.setOnRecordingStatusUpdate(null);
//           recording.stopAndUnloadAsync();
//         }
//       : undefined;
//   }, [recording]);

//   const startRecording = async () => {
//     try {
//       console.log("Requesting permissions..");
//       await Audio.requestPermissionsAsync();
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });
//       console.log("Starting recording..");
//       const newRecording = new Audio.Recording();
//       await newRecording.prepareToRecordAsync(
//         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
//       );
//       await newRecording.startAsync();
//       setRecording(newRecording);
//       console.log("Recording started");
//     } catch (error) {
//       console.error("Failed to start recording", error);
//     }
//   };

//   const stopRecording = async () => {
//     console.log("Stopping recording..");
//     if (!recording) return;
//     try {
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       setAudioPath(uri);
//       setRecording(undefined);
//       console.log("Recording stopped, URI:", uri);
//     } catch (error) {
//       console.error("Failed to stop recording", error);
//     }
//   };

//   const sendEmergency = async () => {
//     setLoading(true);
//     try {
//       const { latitude, longitude } = await getLocation();
//       console.log("Latitude:", latitude, "Longitude:", longitude);

//       // Get current date
//       const currentDate = new Date().toISOString();

//       // Create FormData object to send data including file
//       const formData = new FormData();
//       console.log("form id:",id);
//       formData.append("id",id );
//       formData.append("coordinate", JSON.stringify([latitude, longitude]));
//       formData.append(
//         "message",
//         emergencyMessage ? emergencyMessage : "Acil Durum Çağrısı"
//       );
//       formData.append("record", {
//         uri: audioPath,
//         name: "audio.mp3",
//         type: "audio/mp3",
//       });
//       formData.append("date", currentDate); // Append current date

//       const response = await axios.put(
//         `${process.env.EXPO_PUBLIC_API_URL}/api/coordinate/send-my-coordinate`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log("Cevap: ", response.data.data);
//       if (response.status === 200) {
//         showToast("Acil Yardım Talebi Başarıyla Gönderildi");
//         setLoading(false); // Gönderme işlemi tamamlandığında loading durumunu false olarak güncelle
//       }
//     } catch (error) {
//       showToast(
//         "HATA! Acil yardım talebi gönderilirken bir hata oluştu lütfen tekrar deneyiniz."
//       );
//       console.error(
//         "Hata: ",
//         error
//       );
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={closeModal}
//     >
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "rgba(0, 0, 0, 0.5)",
//         }}
//       >
//         <View
//           style={{
//             backgroundColor: Colors.darkGrey,
//             borderRadius: 20,
//             padding: 20,
//             width: "70%",
//             height: "auto",
//             justifyContent: "flex-start",
//             alignItems: "center",
//             borderWidth: 1,
//             borderColor: "gray",
//           }}
//         >
//           <Text style={{ textAlign: "left", width: "100%", color: "white" }}>
//             Acil Durum Mesajı:
//           </Text>
//           <TextInput
//             style={{
//               borderWidth: 1,
//               borderColor: "gray",
//               marginBottom: 20,
//               height: 40,
//               padding: 5,
//               width: "100%",
//               borderRadius: 10,
//               color: Colors.honeydew,
//             }}
//             onChangeText={(text) => setEmergencyMessage(text)}
//           />
//           <TouchableOpacity
//             style={{
//               marginBottom: 5,
//               justifyContent: "center",
//               alignItems: "center",
//               borderWidth: 2,
//               borderColor: "white",
//               padding: 10,
//               borderRadius: 32,
//               width: 64,
//               height: 64,
//             }}
//             onPress={recording ? stopRecording : startRecording}
//           >
//             <FontAwesome name="microphone" size={24} color={"dodgerblue"} />
//           </TouchableOpacity>
//           <Text style={{ color: "white" }}>
//             {recording ? "Ses Kaydediliyor..." : ""}
//           </Text>
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               width: "90%",
//               paddingTop: 10,
//             }}
//           >
//             <TouchableOpacity
//               style={{ padding: 8 }}
//               disabled={loading}
//               onPress={closeModal}
//             >
//               <Text style={{ color: Colors.red, textAlign: "left" }}>
//                 Kapat
//               </Text>
//             </TouchableOpacity>
//             {loading ? (
//               <ActivityIndicator size="large" color="dodgerblue" />
//             ) : (
//               <TouchableOpacity style={{ padding: 8 }} onPress={sendEmergency}>
//                 <Text style={{ color: Colors.limeGreen, textAlign: "right" }}>
//                   Gönder
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

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
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker for camera functionality
import axios from "axios"; // Import axios for making HTTP requests
import getLocation from "../../../utils/getLocation";
import { showToast } from "../../../utils/toastMessage";

export default function EmergencyModal({ visible, id, closeModal }) {
  const [recording, setRecording] = useState();
  const [audioPath, setAudioPath] = useState("");
  const [emergencyMessage, setEmergencyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // State to store the selected image

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

  const pickImage = async () => {
    // Ask for permission to access the camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);

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
      console.log("form id:", id);
      formData.append("id", id);
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
      if (image) {
        formData.append("image", {
          uri: image,
          name: "photo.jpg",
          type: "image/jpeg",
        });
      }
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
  
      if (response.status === 200) {
        console.log("Cevap: ", response.data.data);
        showToast("Acil Yardım Talebi Başarıyla Gönderildi");
      } else {
        showToast("Acil Yardım Talebi Gönderilemedi");
      }
    } catch (error) {
      console.error("Hata: ", error);
      showToast("HATA! Acil yardım talebi gönderilirken bir hata oluştu lütfen tekrar deneyiniz.");
    } finally {
      setLoading(false); // Loading state should be updated in both success and error cases
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
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
              onPress={pickImage}
            >
              <FontAwesome name="camera" size={24} color={"dodgerblue"} />
            </TouchableOpacity>
          </View>
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
