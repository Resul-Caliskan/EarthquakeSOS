import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView, // Import ScrollView component
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { Colors } from "../../constants/colors";

const SaglikSchema = Yup.object().shape({
  kronikHastaliklar: Yup.string().required("Zorunlu"),
  alerjiler: Yup.string().required("Zorunlu"),
  ilaclar: Yup.string().required("Zorunlu"),
});

const SaglikTakipEkrani = () => {
  const [kronikHastaliklar, setKronikHastaliklar] = useState([]);
  const [alerjiler, setAlerjiler] = useState([]);
  const [ilaclar, setIlaclar] = useState([]);

  const handleAddItem = (item, setItems) => {
    if (item.trim()) {
      setItems((prevItems) => [...prevItems, item]); // Use functional update to ensure correct array manipulation
    }
  };
  const handleRemoveItem = (index, setItems) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index)); // Use functional update and filter to remove the item at the specified index
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
          {kronikHastaliklar.map((item, index) => (
            <View key={index} style={styles.tagContainer}>
              <TouchableOpacity
                onPress={() => handleRemoveItem(index, setKronikHastaliklar)}
              >
                <Text
                  style={[styles.tag, { backgroundColor: Colors.honeydew }]}
                >
                  {item}
                  {
                    <Text
                      style={[
                        styles.tag,
                        {
                          color: Colors.red,
                          marginLeft: 5,
                          backgroundColor: Colors.honeydew,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {" "}
                      X
                    </Text>
                  }
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          {alerjiler.map((item, index) => (
            <View key={index} style={styles.tagContainer}>
              <TouchableOpacity
                onPress={() => handleRemoveItem(index, setAlerjiler)}
              >
                <Text style={[styles.tag, { backgroundColor: Colors.turuncu }]}>
                  {item}
                  {
                    <Text
                      style={[
                        styles.tag,
                        {
                          color: Colors.red,
                          marginLeft: 5,
                          backgroundColor: Colors.turuncu,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {" "}
                      X
                    </Text>
                  }
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {ilaclar.map((item, index) => (
            <View key={index} style={styles.tagContainer}>
              <TouchableOpacity
                onPress={() => handleRemoveItem(index, setIlaclar)}
              >
                <Text
                  style={[
                    styles.tag,
                    { backgroundColor: Colors.mediumspringgreen },
                  ]}
                >
                  {item}
                  {
                    <Text
                      style={[
                        styles.tag,
                        {
                          color: Colors.red,
                          marginLeft: 5,
                          backgroundColor: Colors.mediumspringgreen,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {" "}
                      X
                    </Text>
                  }
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.innerContainer}>
          <Formik
            initialValues={{
              kronikHastaliklar: "",
              alerjiler: "",
              ilaclar: "",
            }}
            validationSchema={SaglikSchema}
            onSubmit={(values) => {
              console.log("Form Değerleri:", values);
              console.log("Kronik Hastalıklar:", kronikHastaliklar);
              console.log("Alerjiler:", alerjiler);
              console.log("İlaçlar:", ilaclar);
            }}
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
                <View>
                  <Text style={styles.label}>Kronik Hastalıklar</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("kronikHastaliklar")}
                    onBlur={handleBlur("kronikHastaliklar")}
                    value={values.kronikHastaliklar}
                  />

                  <TouchableOpacity
                    style={{
                      justifyContent: "flex-end",
                      paddingHorizontal: 15,
                      alignItems: "flex-end",
                    }}
                    onPress={() =>
                      handleAddItem(
                        values.kronikHastaliklar,
                        setKronikHastaliklar
                      )
                    }
                  >
                    <Text style={{ fontSize: 16, color: Colors.honeydew }}>
                      Hastalık Ekle
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.label}>Alerjiler</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("alerjiler")}
                    onBlur={handleBlur("alerjiler")}
                    value={values.alerjiler}
                  />
                  <TouchableOpacity
                    style={{
                      justifyContent: "flex-end",
                      paddingHorizontal: 15,
                      alignItems: "flex-end",
                    }}
                    onPress={() =>
                      handleAddItem(values.alerjiler, setAlerjiler)
                    }
                  >
                    <Text style={{ fontSize: 16, color: Colors.turuncu }}>
                      Alerji Ekle
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.label}>Kullanılan İlaçlar</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("ilaclar")}
                    onBlur={handleBlur("ilaclar")}
                    value={values.ilaclar}
                  />
                  <TouchableOpacity
                    style={{
                      justifyContent: "flex-end",
                      paddingHorizontal: 15,
                      alignItems: "flex-end",
                      marginBottom: 10,
                    }}
                    onPress={() => handleAddItem(values.ilaclar, setIlaclar)}
                  >
                    <Text
                      style={{ fontSize: 16, color: Colors.mediumspringgreen }}
                    >
                      İlaç Ekle
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 2,
                    padding: 5,
                    borderColor: Colors.element1,
                    borderRadius: 10,
                  }}
                  onPress={handleSubmit}
                >
                  <Text style={{ fontSize: 16, color: Colors.element1 }}>
                    SAĞLIK BİLGİLERİMİ KAYDET
                  </Text>
                </TouchableOpacity>
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
