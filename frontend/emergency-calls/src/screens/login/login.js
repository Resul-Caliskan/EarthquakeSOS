import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircleFilled,
  EyeInvisibleOutlined,
  EyeOutlined,
  MailOutlined,
  LockOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, ConfigProvider, Input, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";
import ekip from "../../assets/ekip.png";
import logoIcon from "../../assets/logoIcon.png";
import "./Login.css";

export default function Login() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email, password }
      );
      const token = response.data.accessToken;
      localStorage.setItem("token", token);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/home");
    } catch (error) {
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
                <img src={logo} alt="Resim" className="h-[60vh] z-10" />
                {/* <img src={ekip} alt="Resim" className="w-[70vh] z-10" /> */}
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
      <div className="flex flex-col   justify-center items-center h-screen form-div mx-auto p-5">
        <form
          onSubmit={handleSubmit}
          className={`max-w-[458px] w-full mx-auto  form`}
        >
          <p className="text-3xl  text-left font-semibold">
            {t("login.content")}
          </p>
          <h4 className="text-sm text-left my-6">{t("login.start_content")}</h4>
          <div className="flex flex-col py-2">
            <label className="mb-2 text-gray-600 text-sm">
              {t("login.mail")}
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
              <Space className={" block"}>
                <Input
                  data-test="email"
                  value={email}
                  disabled={loading}
                  placeholder={t("login.mail_placeholder")}
                  rules={[
                    {
                      required: true,
                      message: t("login.mail_message"),
                      type: "email",
                      message: t("login.mail_message_error"),
                    },
                  ]}
                  className={`focus:custom-blue text-sm border pl-3 p-2   ${
                    emailError ? "border-custom-red" : email ? "" : ""
                  } `}
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
              <label className="text-gray-600 text-sm ">
                {t("login.password")}
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
                    placeholder={t("login.password_placeholder")}
                    rules={[
                      {
                        required: true,
                        type: "password",
                        message: t("login.password_message_error"),
                      },
                    ]}
                    className={`focus:custom-blue text-sm mt-2 border pl-3 p-2 ${
                      passwordError ? "border-custom-red" : password ? "" : ""
                    }`}
                    disabled={loading}
                    /* onFocus={() => {
                    setPasswordError();
                  }}*/
                    // onBlur={(e) => {

                    // }}
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
                <p className=" text-custom-red text-xs font-light mt-1">
                  {passwordError}
                </p>
              )}
            </div>
            <div className="flex row justify-between mt-4 mb-2">
              <Checkbox
                className="text-[#133163] text-sm font-light"
                checked={rememberMe}
                onChange={() => {
                  setRememberMe(!rememberMe);
                }}
              >
                {t("login.rememberme")}
              </Checkbox>
              <a href="/volunter">
                <p className="text-[#1b2795] font-light text-sm underline">
                  {t("login.forgot_password")}
                </p>
              </a>
            </div>
          </div>

          {email &&
          password &&
          emailError === false &&
          passwordError === false ? (
            <button
              data-test="loginbutton"
              type="submit"
              className="bg-[#0057D9] text-white w-full h-9  rounded-lg flex items-center justify-center mt-5"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <LoadingOutlined style={{ marginRight: "5px" }} spin />
              ) : null}
              {loading ? "" : t("login.login")}
            </button>
          ) : (
            <Button disabled={true} className="h-9 w-full mt-5">
              {t("login.login")}
            </Button>
          )}

          <div className="mt-2">
            <p className="text-xs  text-center font-thin mt-6">
              {t("login.end_content")}
            </p>
          </div>
        </form>
        <div class="fixed bottom-0 right-0 mb-6 mr-4 vh-logo">
          <img src={logoIcon} alt="Resim" class="h-[50px]" />
        </div>
      </div>
    </div>
  );
}
