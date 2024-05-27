import React, { useState, useEffect } from "react";
import "./App.css";
import ListComponent from "./components/listComponent";
import "leaflet/dist/leaflet.css";
function App() {
  const [selectedOption, setSelectedOption] = useState();
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };
  return (
    <div style={{ flex: 1 }} className="App">
      <div className="font-serif">
        <div className="navbar">
          <div className="absolute top-4">
            <img
              src="https://www.afad.gov.tr/kurumlar/afad.gov.tr/Kurumsal-Kimlik/Logolar/PNG/AFAD-Logo-Renkli.png"
              style={{height:50,backgroundColor:"white",borderRadius:20}}
              alt="Resim"
              className=""
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
        </div>
        <ul className="menu">
          <li
            className={`menu-item ${
              selectedOption === "emergency" ? "selected" : ""
            }`}
          >
            <a
              href="#"
              onClick={() => handleOptionClick("emergency")}
              className="menu-link "
            >
              Acil Çağrılar
            </a>
          </li>
          <li
            className={`menu-item ${
              selectedOption === "map" ? "selected" : ""
            }`}
          >
            <a
              href="#"
              className="menu-link"
              onClick={() => handleOptionClick("map")}
            >
              Çağrı Haritası
            </a>
          </li>
        </ul>
      </div>
      <div className="h-full p-2">
        <ListComponent />
      </div>
    </div>
  );
}

export default App;
