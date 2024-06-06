import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Home from "./screens/home/home";
import Login from "./screens/login/login";
import i18n from "./localization/i18n";
import { t } from "i18next";
import VolunteerRegister from "./screens/login/volunteer";

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
    <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/volunteer" element={<VolunteerRegister />} />
      </Routes>
    </div>
  );
};

export default App;
