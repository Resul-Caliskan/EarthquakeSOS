import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div><div className="navbar">
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
    </div>
  </div>
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
    
      <h1 style={{fontSize:"40px",color:"red"}}>Yetkisiz Giriş</h1>
      <div style={{ marginTop: '20px' }}>
        <button onClick={goToLogin} style={buttonStyle}>
          Giriş Sayfasına Git
        </button>
        <button onClick={goBack} style={{ ...buttonStyle, marginLeft: '10px' }}>
          Geri Dön
        </button>
      </div>
    </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
//   backgroundColor: '#007bff',
  color: '#007bff'  ,
  border: 'none',
  borderRadius: '5px',
};
