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
// firebase.initializeApp(firebaseConfig);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    navigation.replace("home");
    // try {
    //   const userCredential = await firebase
    //     .auth()
    //     .signInWithEmailAndPassword(email, password)
    //     .then(() => {
    //       navigation.replace("Home", { email: email });
    //     });

    //   // Kullanıcı girişi başarılıysa, kullanıcı ana sayfaya yönlendirilir.
    // } catch (error) {
    //   console.error("Kullanıcı girişi hatası:", error.message);
    //   setYanlis("Yanlış Tekrardan Gir");
    //   setEmail("");
    //   setPassword("");
    // }
  };
  const handleRegisterButton = () => {
    navigation.navigate("register");
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <View style={styles.outContianer}>
        <View style={styles.topView}>
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: Colors.white,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 50, fontStyle: "italic", letterSpacing: 10 }}
            >
              ES
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
              ESOS
            </Text>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 12,
                  fontWeight: "600",

                  marginTop: 5,
                },
              ]}
            >
              Devam Etmek İçin Giriş Yapın
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handleLogin();
            }}
          >
            <Text style={styles.text}>Giriş</Text>
          </TouchableOpacity>
          <View
            style={{
              width: "100%",
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                // Burada giriş işlemi için bir fonksiyon çağırabilirsiniz
              }}
            >
              <Text
                style={[
                  styles.text,
                  { borderBottomWidth: 1, borderColor: Colors.white },
                ]}
              >
                Şifremi Unuttum
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleRegisterButton();
              }}
            >
              <Text
                style={[
                  styles.text,
                  { borderBottomWidth: 1, borderColor: Colors.white },
                ]}
              >
                Kayıt Ol
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
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
    alignItems: "center",
  },
  botttomView: {
    flex: 2,
    width: "100%",
    backgroundColor: "#4D4C4C",
    borderTopRightRadius: 80,
    borderTopWidth: 2,
    borderEndWidth: 2,
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
});