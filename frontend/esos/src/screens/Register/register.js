import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Colors } from "../../constants/colors";
import axios from "axios";
import BackButton from "../../components/goBackButton";
import { showToast } from "../../utils/toastMessage";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const isPasswordValid = (password) => {
    return password.length >= 6;
  };

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      alert("Geçerli bir e-posta adresi giriniz.");
      return;
    }

    if (!isPasswordValid(password)) {
      alert("Şifre en az 6 karakter uzunluğunda olmalıdır.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor. Lütfen tekrar kontrol edin.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`,
        {
          email: email,
          password: password,
          name: name,
        }
      );
      showToast(response.data.message);
    } catch (error) {
      console.error(error);
      showToast("Kayıt işlemi başarısız oldu!");
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
            <BackButton navigation={navigation} />
          </View>
          <View style={styles.botttomView}>
            {/* <Image
              source={require("../../../assets/hi.gif")}
              style={{
                width: 30,
                height: 50,
                margin: 20,
                borderWidth: 5,
                borderColor: Colors.white,
                position: "absolute",
                left: 10,
                top: 10,
              }}
            /> */}
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
                  { fontSize: 35, fontWeight: "bold", letterSpacing: 2 },
                ]}
              >
                Hesap Oluştur
              </Text>
            </View>
            <View
              style={{
                width: "60%",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <Text style={[styles.text]}>İsim</Text>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setName(text)}
              value={name}
              placeholder="İsminizi giriniz..."
              placeholderTextColor="#E4E1E1"
            />
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
            <View
              style={{
                width: "60%",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <Text style={[styles.text]}>Şifre</Text>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholder="Şifre giriniz..."
              placeholderTextColor="#E4E1E1"
              secureTextEntry
            />
            <View
              style={{
                width: "60%",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <Text style={[styles.text]}>Şifre Tekrarı</Text>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              placeholder="Şifreyi tekrar giriniz..."
              placeholderTextColor="#E4E1E1"
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleRegister();
              }}
            >
              <Text style={styles.text}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "20%",
  },
  keyboardView: { flex: 1 },
  outContianer: { flex: 1, width: "100%" },
  topView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 20,
    marginTop: 10,
  },
  botttomView: {
    flex: 6,
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.limeGreen,
    position: "absolute",
    left: 15,
    top: 40,
    borderRadius: 15,
  },
});
