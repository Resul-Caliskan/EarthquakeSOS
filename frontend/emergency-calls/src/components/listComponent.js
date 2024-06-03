import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import socket from "../config/socketConfig"; // Adjust the import according to your file structure

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const customIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

function createData(
  id,
  title,
  description,
  time,
  audioUrl,
  healthInfo,
  coordinate
) {
  const defaultHealthInfo = {
    alerjiler: [],
    ilaclar: [],
    kronikHastaliklar: [],
    ...healthInfo,
  };
  return {
    id,
    title,
    description,
    time,
    audioUrl,
    healthInfo: defaultHealthInfo,
    coordinate,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>{new Date(row.time).toLocaleString()}</TableCell>
        <TableCell>
          {row.audioUrl && (
            <audio controls>
              <source src={row.audioUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ fontWeight: "bold" }}
              >
                Detaylar
              </Typography>
              <Typography>{row.description}</Typography>
              <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                Sağlık Bilgileri:
              </Typography>
              <Typography>
                Alerjiler: {row.healthInfo.alerjiler.join(", ") || "Yok"}
              </Typography>
              <Typography>
                İlaçlar: {row.healthInfo.ilaclar.join(", ") || "Yok"}
              </Typography>
              <Typography>
                Kronik Hastalıklar:{" "}
                {row.healthInfo.kronikHastaliklar.join(", ") || "Yok"}
              </Typography>
              {row.coordinate && row.coordinate.length === 2 && (
                <MapContainer
                  style={{
                    height: "200px",
                    width: "100%",
                    marginTop: "10px",
                  }}
                  center={[row.coordinate[0], row.coordinate[1]]}
                  zoom={13}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[row.coordinate[0], row.coordinate[1]]}
                    icon={customIcon}
                  >
                    <Popup>{row.title}</Popup>
                  </Marker>
                </MapContainer>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    time: PropTypes.string,
    audioUrl: PropTypes.string,
    healthInfo: PropTypes.shape({
      alerjiler: PropTypes.array.isRequired,
      ilaclar: PropTypes.array.isRequired,
      kronikHastaliklar: PropTypes.array.isRequired,
    }).isRequired,
    coordinate: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};

export default function ListComponent() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://earthquakesos.onrender.com/api/coordinate/emergency"
        );
        if (isMounted) {
          const data = response.data.data;
          console.log("Data:", response.data.data);
          const formattedData = data.map((item) => {
            if (item.record) {
              item.audioUrl = `data:audio/mp3;base64,${item.record}`;
            }
            console.log("Data Uadio:",item.audioUrl);
            const coordinates = item.coordinate[0]
              .replace("[", "")
              .replace("]", "")
              .split(",")
              .map((coord) => parseFloat(coord.trim()));
            return createData(
              item._id,
              item.name,
              item.message,
              item.time,
              item.audioUrl || "", 
              item.healthInfo,
              coordinates
            );
          });
          setRows(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const handleEmergencyWeb = (data) => {
      const coordinates = data.coordinate[0]
        .replace("[", "")
        .replace("]", "")
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      const newEmergency = createData(
        data.id,
        data.name,
        data.message,
        data.time,
        data.record ? `data:audio/mp3;base64,${data.record}` : "",
        data.healthInfo,
        coordinates
      );

      if (isMounted) {
        setRows((prevRows) => [newEmergency, ...prevRows]);
      }
    };

    socket.on("emergencyWeb", handleEmergencyWeb);

    // Cleanup WebSocket event listener and isMounted flag on component unmount
    return () => {
      isMounted = false;
      socket.off("emergencyWeb", handleEmergencyWeb);
    };
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Çağrıyı Yapan</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Zaman</TableCell>
              <TableCell>Ses Kaydı</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}
