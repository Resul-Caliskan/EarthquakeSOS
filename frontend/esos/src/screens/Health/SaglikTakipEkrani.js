import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  StatusBar,
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { fontSize: 20 }]}>Sağlık Bilgilerim</Text>
      </View>
      <View style={styles.innerContainer}>
        <Formik
          initialValues={{ kronikHastaliklar: "", alerjiler: "", ilaclar: "" }}
          validationSchema={SaglikSchema}
          onSubmit={(values) => {
            console.log(values);
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
              <Text style={styles.label}>Kronik Hastalıklar</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("kronikHastaliklar")}
                onBlur={handleBlur("kronikHastaliklar")}
                value={values.kronikHastaliklar}
              />
              {errors.kronikHastaliklar && touched.kronikHastaliklar ? (
                <Text style={styles.errorText}>{errors.kronikHastaliklar}</Text>
              ) : null}

              <Text style={styles.label}>Alerjiler</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("alerjiler")}
                onBlur={handleBlur("alerjiler")}
                value={values.alerjiler}
              />
              {errors.alerjiler && touched.alerjiler ? (
                <Text style={styles.errorText}>{errors.alerjiler}</Text>
              ) : null}

              <Text style={styles.label}>Kullanılan İlaçlar</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("ilaclar")}
                onBlur={handleBlur("ilaclar")}
                value={values.ilaclar}
              />
              {errors.ilaclar && touched.ilaclar ? (
                <Text style={styles.errorText}>{errors.ilaclar}</Text>
              ) : null}

              <Button onPress={handleSubmit} title="Kaydet" />
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkGrey,
  },
  header: {
    top: StatusBar.currentHeight,
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
  errorText: {
    color: "red",
  },
});

export default SaglikTakipEkrani;
