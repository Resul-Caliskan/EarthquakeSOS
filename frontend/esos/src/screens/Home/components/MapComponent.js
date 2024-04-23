import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapComponent = ({ userLocation }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 41.0082,
          longitude: 28.9784,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 41.0082, longitude: 28.9784 }}
          title="Güvenli Alan"
        />
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Konumunuz"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
  },
});

export default MapComponent;
