import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircleFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
  MailOutlined,
  LockOutlined,
  LoadingOutlined,
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Input, Space, Row, Col } from "antd";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import logoIcon from "../../assets/logoIcon.png";
import logo from "../../assets/gonullu.png";
import "./Login.css"; // Aynı CSS dosyasını kullanıyoruz

export default function VolunteerRegister() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 576) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.cookie = `i18next=${lng}; path=/`;
    document.title = "AFAD | ESOS";
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value) ? "" : "Geçersiz email formatı");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(
      validatePassword(value) ? "" : "Parola en az 6 karakter olmalıdır"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      setEmailError("Geçersiz email formatı");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Parola en az 6 karakter olmalıdır");
      setLoading(false);
      return;
    }

    try {
      const role= "user";
      await axios.post(`http://localhost:5000/api/web/register`, {
        email,
        password,
        role,
        name,
        surname,
        phone,
        address,
      });
      toast.success(t("messages.registration_success"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      toast.error(error || t("messages.registration_failure"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex container-div">
      <div className="loginNone">
        <div className="flex flex-col justify-center items-center bg-slate-200 h-screen login-image">
          {isVisible && (
            <div className="loginFirst">
              <div className="loginSecond">
                <img src={logo} alt="Resim" className="h-[50vh] z-10" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row absolute right-0 mr-3 mt-2 ">
        <button className="mr-4" onClick={() => changeLanguage("en")}>
          English
        </button>
        <button onClick={() => changeLanguage("tr")}>Türkçe</button>
      </div>
      <div className="flex flex-col justify-center items-center h-screen form-div mx-auto p-5">
        <form
          onSubmit={handleSubmit}
          className={`max-w-[458px] w-full mx-auto form`}
        >
          <p className="text-3xl text-left font-semibold">
            {t("volunteer_register.title")}
          </p>
          <h4 className="text-sm text-left my-6">
            {t("volunteer_register.start_content")}
          </h4>
          <Row gutter={16}>
            <Col span={12}>
              <div className="flex flex-col py-2">
                <label className="mb-2 text-gray-600 text-sm">
                  {t("volunteer_register.name")}
                </label>
                <Input
                  data-test="name"
                  value={name}
                  disabled={loading}
                  placeholder={t("volunteer_register.name_placeholder")}
                  className="focus:custom-blue text-sm border pl-3 p-2"
                  onChange={(e) => setName(e.target.value)}
                  prefix={<UserOutlined className="mr-2 text-gray-500" />}
                />
              </div>
            </Col>
            <Col span={12}>
              <div className="flex flex-col py-2">
                <label className="mb-2 text-gray-600 text-sm">
                  {t("volunteer_register.surname")}
                </label>
                <Input
                  data-test="surname"
                  value={surname}
                  disabled={loading}
                  placeholder={t("volunteer_register.surname_placeholder")}
                  className="focus:custom-blue text-sm border pl-3 p-2"
                  onChange={(e) => setSurname(e.target.value)}
                  prefix={<UserOutlined className="mr-2 text-gray-500" />}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <div className="flex flex-col py-2">
                <label className="mb-2 text-gray-600 text-sm">
                  {t("volunteer_register.phone")}
                </label>
                <Input
                  data-test="phone"
                  value={phone}
                  disabled={loading}
                  placeholder={t("volunteer_register.phone_placeholder")}
                  className="focus:custom-blue text-sm border pl-3 p-2"
                  onChange={(e) => setPhone(e.target.value)}
                  prefix={<PhoneOutlined className="mr-2 text-gray-500" />}
                />
              </div>
            </Col>
            <Col span={12}>
              <div className="flex flex-col py-2">
                <label className="mb-2 text-gray-600 text-sm">
                  {t("volunteer_register.address")}
                </label>
                <Input
                  data-test="address"
                  value={address}
                  disabled={loading}
                  placeholder={t("volunteer_register.address_placeholder")}
                  className="focus:custom-blue text-sm border pl-3 p-2"
                  onChange={(e) => setAddress(e.target.value)}
                  prefix={<HomeOutlined className="mr-2 text-gray-500" />}
                />
              </div>
            </Col>
          </Row>
          <div className="flex flex-col py-2">
            <label className="mb-2 text-gray-600 text-sm">
              {t("volunteer_register.mail")}
            </label>
            <ConfigProvider
              theme={{
                components: {
                  Input: emailError
                    ? {
                        colorPrimary: "#133163",
                        hoverBorderColor: "red",
                        activeBorderColor: "red",
                      }
                    : {
                        colorPrimary: "#133163",
                        hoverBorderColor: "#133163",
                        activeBorderColor: "#133163",
                      },
                },
              }}
            >
              <Space className={"block"}>
                <Input
                  data-test="email"
                  value={email}
                  disabled={loading}
                  placeholder={t("volunteer_register.mail_placeholder")}
                  className={`focus:custom-blue text-sm border pl-3 p-2 ${
                    emailError ? "border-custom-red" : email ? "" : ""
                  }`}
                  onFocus={() => {
                    setEmailError();
                  }}
                  onBlur={(e) => {
                    handleEmailChange(e);
                    setEmail(e.target.value);
                  }}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  prefix={
                    <MailOutlined
                      className={`mr-2 ${
                        emailError
                          ? "text-red-500"
                          : email && emailError === false
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    />
                  }
                  suffix={
                    emailError ? (
                      <div style={{ paddingRight: "8px" }}>
                        <IoCloseCircleSharp
                          className="text-red-500 size-[16px] cursor-pointer ml-2"
                          onClick={() => {
                            setEmail("");
                            setEmailError("");
                          }}
                        />
                      </div>
                    ) : email && emailError === false ? (
                      <div style={{ paddingRight: "8px" }}>
                        <CheckCircleFilled
                          style={{
                            color: "#52c41a",
                            fontSize: 14,
                            marginTop: 2,
                          }}
                        />
                      </div>
                    ) : null
                  }
                />
              </Space>
            </ConfigProvider>
            {emailError && (
              <p className="text-custom-red text-xs font-light mt-1">
                {emailError}
              </p>
            )}
          </div>
          <div className="flex flex-col py-2">
            <div className="relative">
              <label className="text-gray-600 text-sm">
                {t("volunteer_register.password")}
              </label>
              <ConfigProvider
                theme={{
                  components: {
                    Input: passwordError
                      ? {
                          colorPrimary: "#133163",
                          hoverBorderColor: "red",
                          activeBorderColor: "red",
                        }
                      : {
                          colorPrimary: "#133163",
                          hoverBorderColor: "#133163",
                          activeBorderColor: "#133163",
                        },
                  },
                }}
              >
                <Space className="block">
                  <Input
                    data-test="password"
                    value={password}
                    placeholder={t("volunteer_register.password_placeholder")}
                    className={`focus:custom-blue text-sm mt-2 border pl-3 p-2 ${
                      passwordError ? "border-custom-red" : password ? "" : ""
                    }`}
                    disabled={loading}
                    onChange={(e) => {
                      handlePasswordChange(e);
                      setPassword(e.target.value);
                    }}
                    prefix={
                      <LockOutlined
                        className={`mr-2 ${
                          passwordError
                            ? "text-red-500"
                            : password && passwordError === false
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                      />
                    }
                    suffix={
                      <div
                        className="flex flex-row items-center justify-center"
                        style={{ paddingRight: "8px" }}
                      >
                        {showPassword ? (
                          <EyeInvisibleOutlined
                            className="mr-2 size-4"
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                          />
                        ) : (
                          <EyeOutlined
                            className="mr-2 size-4"
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                          />
                        )}
                        {passwordError && (
                          <IoCloseCircleSharp
                            className="text-red-500 size-4 cursor-pointer"
                            onClick={() => {
                              setPassword("");
                              setPasswordError("");
                            }}
                          />
                        )}
                        {passwordError === false && password && (
                          <CheckCircleFilled className="text-green-500 size-4" />
                        )}
                      </div>
                    }
                    type={showPassword ? "text" : "password"}
                  />
                </Space>
              </ConfigProvider>
              {passwordError && (
                <p className="text-custom-red text-xs font-light mt-1">
                  {passwordError}
                </p>
              )}
            </div>
          </div>

          {email && password && !emailError && !passwordError ? (
            <button
              data-test="registerbutton"
              type="submit"
              className="bg-[#0057D9] text-white w-full h-9 rounded-lg flex items-center justify-center mt-5"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <LoadingOutlined style={{ marginRight: "5px" }} spin />
              ) : null}
              {loading ? "" : t("volunteer_register.register")}
            </button>
          ) : (
            <Button disabled={true} className="h-9 w-full mt-5">
              {t("volunteer_register.register")}
            </Button>
          )}

          <div className="mt-2">
            <p className="text-xs text-center font-thin mt-6">
              {t("volunteer_register.end_content")}
            </p>
          </div>
        </form>
        <div className="fixed bottom-0 right-0 mb-6 mr-4 vh-logo">
          <img src={logoIcon} alt="Resim" className="h-[50px]" />
        </div>
      </div>
    </div>
  );
}
