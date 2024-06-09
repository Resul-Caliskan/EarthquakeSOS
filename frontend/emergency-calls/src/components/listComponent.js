import React, { useEffect, useState, useCallback } from "react";
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import socket from "../config/socketConfig"; // Adjust the import according to your file structure
import { withTranslation } from "react-i18next";
import { getTeams, handleEmergency } from "../backend/teamApi";
import { LoadingOutlined } from "@ant-design/icons";

const BASE_URL = "https://earthquakesos.onrender.com"; // Make sure this matches your backend URL

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
  imageUrl,
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
    imageUrl,
    healthInfo: defaultHealthInfo,
    coordinate,
  };
}

function Row(props) {
  const { row, t, assignedTeams, setAssignedTeams } = props;
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const fetchTeams = useCallback(async () => {
    try {
      const teamsData = await getTeams();
      setTeams(teamsData.filter((team) => !assignedTeams.includes(team.name)));
      console.log("takımlar", teams, assignedTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  }, [assignedTeams]);

  useEffect(() => {
    if (open) {
      fetchTeams();
    }
  }, [open, fetchTeams]);

  const handleTeamSelect = (teamId) => {
    setSelectedTeam(teamId);
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await handleEmergency(row.id, selectedTeam); // Assuming selectedUserId is the ID of the user you want to update
      setAssignedTeams((prev) => [...prev, selectedTeam]);
      toast.success("Team assignment and emergency update successful");
    } catch (error) {
      toast.error(`Error handling emergency: ${error.message}`);
    } finally {
      setConfirming(false);
      setConfirmed(true);
    }
  };

  useEffect(() => {
    console.log("Row updated", row.audioUrl); // Debugging log
  }, [row]);

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
            <audio key={row.audioUrl} controls>
              <source src={row.audioUrl} type="audio/mp3" />
              {t("listComponent.audio_error")}
            </audio>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div className="grid grid-cols-2">
                <div className="justify-center items-center">
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    style={{ fontWeight: "bold" }}
                  >
                    {t("listComponent.details")}
                  </Typography>
                  <Typography style={{ marginBottom: 10 }}>
                    {t("listComponent.message")}: {row.description}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold" }}
                  >
                    {t("listComponent.health_info")}
                  </Typography>
                  <Typography>
                    {t("listComponent.allergies")}:{" "}
                    {row.healthInfo.alerjiler.join(", ") ||
                      t("listComponent.none")}
                  </Typography>
                  <Typography>
                    {t("listComponent.medications")}:{" "}
                    {row.healthInfo.ilaclar.join(", ") ||
                      t("listComponent.none")}
                  </Typography>
                  <Typography>
                    {t("listComponent.chronic_illnesses")}:{" "}
                    {row.healthInfo.kronikHastaliklar.join(", ") ||
                      t("listComponent.none")}
                  </Typography>
                </div>
                <div>
                  <Tabs value={selectedTab} onChange={handleChangeTab}>
                    <Tab label={t("listComponent.location")} />
                    <Tab label={t("listComponent.image")} />
                    <Tab label={t("listComponent.teams")} />
                  </Tabs>

                  {selectedTab === 2 && (
                    <div className="mt-4">
                      {" "}
                      <Typography
                        variant="subtitle1"
                        style={{ marginBottom: 10, fontWeight: "initial" }}
                      >
                        {t("listComponent.team-description")}{" "}
                      </Typography>{" "}
                      {isConfirmed ? (
                        <p style={{ color: "limegreen", fontSize: 16 }}>
                          {t("listComponent.team_confirmed")}
                        </p>
                      ) : (
                        <>
                          {" "}
                          <select
                            className="bg-red-500 p-2 rounded-md mb-2 mr-2"
                            value={selectedTeam}
                            onChange={(e) => handleTeamSelect(e.target.value)}
                          >
                            {" "}
                            <option value="">
                              {t("listComponent.select")}
                            </option>{" "}
                            {teams.map((team) => (
                              <option key={team._id} value={team._id}>
                                {" "}
                                {team.name}{" "}
                              </option>
                            ))}{" "}
                          </select>{" "}
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
                            onClick={handleConfirm}
                            disabled={!selectedTeam || confirming}
                          >
                            {" "}
                            {confirming ? (
                              <LoadingOutlined className="px-3" />
                            ) : (
                              t("listComponent.confirm")
                            )}{" "}
                          </button>{" "}
                        </>
                      )}
                    </div>
                  )}

                  {selectedTab === 1 && row.imageUrl && (
                    <img
                      src={row.imageUrl}
                      alt="Emergency"
                      style={{ width: "20%", marginTop: "10px" }}
                    />
                  )}

                  {selectedTab === 0 &&
                    row.coordinate &&
                    row.coordinate.length === 2 && (
                      <MapContainer
                        style={{
                          height: "200px",
                          width: "75%",
                          alignItems: "center",
                          justifyContent: "center",
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
                </div>
              </div>
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
    imageUrl: PropTypes.string,
    healthInfo: PropTypes.shape({
      alerjiler: PropTypes.array.isRequired,
      ilaclar: PropTypes.array.isRequired,
      kronikHastaliklar: PropTypes.array.isRequired,
    }).isRequired,
    coordinate: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
  assignedTeams: PropTypes.array.isRequired,
  setAssignedTeams: PropTypes.func.isRequired,
};

const TranslatedRow = withTranslation()(Row);

function ListComponent({ t }) {
  const [rows, setRows] = useState([]);
  const [assignedTeams, setAssignedTeams] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/coordinate/emergency`
        );
        if (isMounted) {
          const data = response.data.data;
          console.log("Data:", data);
          const formattedData = data.map((item) => {
            if (item.recordUrl) {
              item.audioUrl = item.recordUrl;
            }
            if (item.imageUrl) {
              item.imageUrl = item.imageUrl;
            }
            const coordinates = item.coordinate[0]
              .replace("[", "")
              .replace("]", "")
              .split(",")
              .map((coord) => parseFloat(coord.trim()));

            return createData(
              item._id,
              item.name,
              item.message,
              item.createdAt,
              item.recordUrl,
              item.imageUrl,
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
      console.log("Audio url", data.audioUrl);
      const newEmergency = createData(
        data.id,
        data.name,
        data.message,
        data.time,
        data.audioUrl,
        data.imageUrl,
        data.healthInfo,
        coordinates
      );

      if (isMounted) {
        setRows((prevRows) => {
          const index = prevRows.findIndex((row) => row.id === data.id);
          if (index !== -1) {
            // Update existing entry
            const updatedRows = [...prevRows];
            updatedRows[index] = newEmergency;
            return updatedRows;
          } else {
            // Add new entry
            return [newEmergency, ...prevRows];
          }
        });
      }
    };

    socket.on("emergencyWeb", handleEmergencyWeb);

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
              <TableCell>{t("listComponent.caller")}</TableCell>
              <TableCell>{t("listComponent.description")}</TableCell>
              <TableCell>{t("listComponent.time")}</TableCell>
              <TableCell>{t("listComponent.audio")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TranslatedRow
                key={row.id}
                row={row}
                t={t}
                assignedTeams={assignedTeams}
                setAssignedTeams={setAssignedTeams}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}

ListComponent.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(ListComponent);
