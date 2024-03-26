import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleButton = () => {
    navigation.navigate("home");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>ESOS GİRİŞ</Text>
      <Text style={styles.text}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email adresinizi giriniz..."
        placeholderTextColor={"#290f3"}
        onChange={email}
        keyboardType="email"
      />
      <Text style={styles.text}>Şifre</Text>
      <TextInput
        style={styles.input}
        keyboardType="password"
        placeholder="Şifrenizi giriniz..."
        onChange={password}
      />
      <TouchableOpacity onPress={() => {}} style={styles.button}>
        <Text style={styles.textButton}>Giriş</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2f2f2f",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    color: "#fff",
  },
  input: { height: 50, width: "95%", backgroundColor: "grey" },
  button: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "white",
    padding: 12,
  },
  textButton: { fontSize: 16, color: "white", fontWeight: "bold" },
  text: { fontSize: 18, fontWeight: "600", letterSpacing: 1.5, color: "white" },
});
