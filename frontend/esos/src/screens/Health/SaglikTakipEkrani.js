import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios"; // Import Axios for API calls
import { Colors } from "../../constants/colors";
import { useRoute } from "@react-navigation/native";

const SaglikSchema = Yup.object().shape({
  kronikHastaliklar: Yup.string().required("Zorunlu"),
  alerjiler: Yup.string().required("Zorunlu"),
  ilaclar: Yup.string().required("Zorunlu"),
});

const SaglikTakipEkrani = () => {
  const route = useRoute();
  const { id } = route.params;
  const [kronikHastaliklar, setKronikHastaliklar] = useState([]);
  const [alerjiler, setAlerjiler] = useState([]);
  const [ilaclar, setIlaclar] = useState([]);

  const handleAddItem = (item, setItems) => {
    if (item.trim()) {
      setItems((prevItems) => [...prevItems, item]);
    }
  };
  const handleRemoveItem = (index, setItems) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values) => {
    try {
      // Make API call to save health information
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/user/health`,
        {
          userId: id, // Replace with the actual user ID
          healthInfo: {
            kronikHastaliklar: kronikHastaliklar,
            alerjiler: alerjiler,
            ilaclar: ilaclar,
          },
        }
      );

      console.log("API response:", response.data);
      // You can handle success message or any other action here
    } catch (error) {
      console.error("API error:", error);
      // You can handle error message or any other action here
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.label, { fontSize: 20 }]}>
            Sağlık Bilgilerim
          </Text>
        </View>
        <View style={{ padding: 5, flexDirection: "row", flexWrap: "wrap" }}>
          {/* Tags display logic */}
        </View>
        <View style={styles.innerContainer}>
          <Formik
            initialValues={{
              kronikHastaliklar: "",
              alerjiler: "",
              ilaclar: "",
            }}
            validationSchema={SaglikSchema}
            onSubmit={handleSubmit} // Pass handleSubmit function to Formik onSubmit prop
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                {/* Form fields */}
                {/* Submit button */}
              </View>
            )}
          </Formik>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.darkGrey,
  },
  header: {
    paddingTop: StatusBar.currentHeight || 0,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.red,
    marginBottom: 20,
  },
  innerContainer: { padding: 20 },
  label: {
    marginVertical: 10,
    fontSize: 16,
    color: Colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: Colors.white,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  tag: {
    backgroundColor: "lightgray",
    padding: 8,
    marginRight: 5,
    borderRadius: 5,
  },
});

export default SaglikTakipEkrani;
