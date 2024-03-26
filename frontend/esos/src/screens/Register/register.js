import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Colors } from "../../constants/colors";
// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/database";
// import firebaseConfig from "../../backEnd/firebaseFunctions/firebaseConfig";
import BackButton from "../../components/goBackButton";

// firebase.initializeApp(firebaseConfig);

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Yeni eklendi

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
    // try {
    //   const userCredential = await firebase
    //     .auth()
    //     .createUserWithEmailAndPassword(email, password);

    //   // Kullanıcı bilgilerini Firestore'a kaydet
    //   await firebase.firestore().collection("users").doc(email).set({
    //     name,
    //     score,
    //     weeklyStats,
    //   });

    //   console.log("Kullanıcı başarıyla oluşturuldu:", userCredential.user.uid);
    //   navigation.replace("Home", { email: email });
    // } catch (error) {
    //   console.error("Kullanıcı oluşturma hatası:", error.message);
    // }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <View style={styles.outContianer}>
        <View style={styles.topView}>
          <BackButton navigation={navigation} />
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
            placeholder="İsminizi giriniz"
            placeholderTextColor="#8F8E8E"
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
            placeholder="Email adresi giriniz"
            placeholderTextColor="#8F8E8E"
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
            placeholder="Şifre giriniz"
            placeholderTextColor="#8F8E8E"
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
            placeholder="Şifreyi tekrar giriniz"
            placeholderTextColor="#8F8E8E"
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
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "50%",
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
    backgroundColor: "#4D4C4C",
    borderTopLeftRadius: 80,
    borderTopWidth: 3,
    borderStartWidth: 1,
    borderColor: Colors.white,
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
