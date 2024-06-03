import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import socket from "../config/socketConfig"; // Adjust the import according to your file structure

const customIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

const CallsMap = () => {
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          "https://earthquakesos.onrender.com/api/coordinate/emergency"
        );
        const data = response.data.data;
        const formattedCoordinates = data.map((item) => {
          const coords = item.coordinate[0]
            .replace("[", "")
            .replace("]", "")
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          return {
            id: item._id,
            name: item.name,
            message: item.message,
            time: item.time,
            coordinate: coords,
          };
        });
        setCoordinates(formattedCoordinates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCoordinates();

    socket.on("emergencyWeb", (data) => {
      const coords = data.coordinate[0]
        .replace("[", "")
        .replace("]", "")
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      const newEmergency = {
        id: data.id,
        name: data.name,
        message: data.message,
        time: data.time,
        coordinate: coords,
      };
      setCoordinates((prevCoordinates) => [newEmergency, ...prevCoordinates]);
    });

    return () => {
      socket.off("emergencyWeb");
    };
  }, []);

  return (
    <MapContainer
      style={{ height: "100vh", width: "100%" }}
      center={[39.9334, 32.8597]} // Center the map to a default location, e.g., Ankara, Turkey
      zoom={6}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {coordinates.map((location) => (
        <Marker
          key={location.id}
          position={location.coordinate}
          icon={customIcon}
        >
          <Popup>
            <div>
              <h3>{location.name}</h3>
              <p>{location.message}</p>
              <p>{new Date(location.time).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CallsMap;
