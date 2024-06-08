// src/pages/Home.js
import React, { useState, useEffect } from "react";
import "./home.css";
import "leaflet/dist/leaflet.css";
import ListComponent from "../../components/listComponent";
import socket from "../../config/socketConfig";
import CallsMap from "../../components/callsMap";
import { getRoleFromToken } from "../../utils/getRole";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Home() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("emergency");
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const token = localStorage.getItem("token");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.cookie = `i18next=${lng}; path=/`;
    document.title = "AFAD | ESOS";
  };

  useEffect(() => {
    // Perform role check and set loading status
    if (!token) {
      navigate("/forbidden");
    } else {
      const role = getRoleFromToken(token);
      if (role === "user") {
        navigate("/forbidden");
      } else {
        setIsLoading(false);
      }
    }
  }, [token, navigate]);

  useEffect(() => {
    const onNotificationConnect = () => {
      console.log("Bağladım Web");
    };
    socket.on("connect", onNotificationConnect);
    return () => {
      socket.off("connect", onNotificationConnect);
    };
  }, []);

  if (isLoading) {
    return null; // Render nothing or a loading spinner while checking the role
  }

  return (
    <div style={{ flex: 1 }} className="App">
      <div className="font-serif">
        <div className="navbar">
          <div className="absolute top-4">
            <img
              src="https://www.afad.gov.tr/kurumlar/afad.gov.tr/Kurumsal-Kimlik/Logolar/PNG/AFAD-Logo-Renkli.png"
              style={{ height: 50, backgroundColor: "white", borderRadius: 20 }}
              alt="Resim"
            />
          </div>
          <div className="majormenu">
            <div className="rectangleContainer">
              <div className="rectangleSubtract"></div>
              <div className="rectangleLeft"></div>
              <div className="rectangleCenter">
                <label className="text-gray-700 flex items-center justify-center h-full labelTab text-xl font-semibold">
                  ESOS
                </label>
              </div>
              <div className="rectangleRight"></div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <button className="mr-4" onClick={() => changeLanguage("en")}>
              English
            </button>
            <button className="mr-4" onClick={() => changeLanguage("tr")}>
              Türkçe
            </button>
            <button onClick={handleLogout} className="logout-button">
              {t("home.logout")}
            </button>
          </div>
        </div>
        <ul className="menu">
          <li
            className={`menu-item ${
              selectedOption === "emergency"
                ? "border-b-2 border-b-black bg-gray-200"
                : ""
            }`}
          >
            <a
              href="#"
              onClick={() => handleOptionClick("emergency")}
              className="menu-link"
            >
              {t("home.emergency_calls")}
            </a>
          </li>
          <li
            className={`menu-item ${
              selectedOption === "map"
                ? "border-b-2 border-b-black bg-gray-200"
                : ""
            }`}
          >
            <a
              href="#"
              className="menu-link"
              onClick={() => handleOptionClick("map")}
            >
              {t("home.call_map")}
            </a>
          </li>
          <li
            className={`menu-item ${
              selectedOption === "team"
                ? "border-b-2 border-b-black bg-gray-200"
                : ""
            }`}
          >
            <a
              href="#"
              className="menu-link"
              onClick={() => handleOptionClick("team")}
            >
              {t("home.team_management")}
            </a>
          </li>
        </ul>
      </div>
      <div className="h-full p-2">
        {selectedOption === "emergency" && <ListComponent t={t} />}
        {selectedOption === "map" && <CallsMap />}
        {selectedOption === "team" && <CallsMap />}
      </div>
    </div>
  );
}

export default Home;
