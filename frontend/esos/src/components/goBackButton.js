import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { StyleSheet,TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";
const BackButton = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <Icon name="arrow-left" size={20} color="black" />
    </TouchableOpacity>
  );
};
export default BackButton;
const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.limeGreen,
    borderRadius: 15,
  },
});