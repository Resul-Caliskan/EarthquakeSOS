import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./screens/home/home";
import Login from "./screens/login/login";
import i18n from "./localization/i18n";
import { t } from "i18next";
import VolunteerRegister from "./screens/login/volunter";
const App = () => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized) {
      getLanguageCookie();
      setInitialized(true);
    }
  }, [initialized]);

  const getLanguageCookie = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");

      if (name === "i18next") {
        i18n.changeLanguage(value);
      }
    }
    if (i18n.language === undefined) {
      i18n.changeLanguage("tr");
    }
    document.title = "AFAD | ESOS";
  };
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/volunter" element={<VolunteerRegister />} />
      </Routes>
    </div>
  );
};

export default App;
