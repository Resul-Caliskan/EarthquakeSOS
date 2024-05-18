import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Colors } from "../../constants/colors";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi girin.");
      return;
    }

    try {
      const response = await fetch(
        "https://your-backend-api.com/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        Alert.alert(
          "Başarılı",
          "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."
        );
      } else {
        Alert.alert("Hata", "Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      Alert.alert("Hata", "Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <ImageBackground
        source={require("../../../assets/login.png")}
        style={styles.container}
      >
        <View style={styles.outContianer}>
          <View style={styles.topView}>
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: Colors.red,
                borderWidth: 3,
                borderColor: Colors.black,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: 50,
                  fontStyle: "italic",
                  letterSpacing: 10,
                }}
              >
                A
              </Text>
            </View>
          </View>
          <View style={styles.botttomView}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              <Text
                style={[
                  styles.text,
                  { fontSize: 40, fontWeight: "bold", letterSpacing: 2 },
                ]}
              >
                AFET
              </Text>
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 18,
                    fontWeight: "600",
                    marginTop: 5,
                  },
                ]}
              >
                Şifre Sıfırlama
              </Text>
            </View>
            <View
              style={{
                width: "60%",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <Text style={[styles.text]}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="Email adresi giriniz..."
              placeholderTextColor="#E4E1E1"
              keyboardType="email-address"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleForgotPassword}
            >
              <Text style={styles.text}>Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.text}>Geri Dön</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "35%",
  },
  keyboardView: { flex: 1 },
  outContianer: { flex: 1, width: "100%" },
  topView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  botttomView: {
    flex: 2,
    width: "100%",
    backgroundColor: Colors.red,
    borderTopLeftRadius: 80,
    borderTopWidth: 3,
    borderStartWidth: 3,
    borderColor: Colors.black,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    color: Colors.white,
    fontSize: 16,
  },
  input: {
    height: 50,
    width: "65%",
    margin: 12,
    padding: 10,
    borderRadius: 16,
    backgroundColor: "#666565",
    color: Colors.white,
    fontSize: 16,
  },
  button: {
    width: "65%",
    borderRadius: 16,
    height: 50,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C2120",
  },
});

export default ForgotPasswordScreen;
