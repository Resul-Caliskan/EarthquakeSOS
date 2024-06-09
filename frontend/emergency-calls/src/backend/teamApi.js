import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//BAse URL değişecek
const API_URL = "http://localhost:5000/api";

export const getUnassignedUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/web/users/unassigned`);
    // toast.success('Gönüllüler Başarıyla Listelelendi');
    return response.data;
  } catch (error) {
    toast.error(
      `Gönüllülere Ulaşılamadı: ${
        error.response?.data?.message || error.message
      }`
    );
    throw error;
  }
};

export const getTeams = async () => {
  try {
    const response = await axios.get(`${API_URL}/teams`);
    // toast.success('Takımlar Başarıyla Listelendi');
    return response.data;
  } catch (error) {
    toast.error(
      `Takımlara Ulaşılamadı: ${error.response?.data?.message || error.message}`
    );
    throw error;
  }
};

export const createTeam = async (teamName) => {
  try {
    const response = await axios.post(`${API_URL}/teams`, { name: teamName });
    toast.success("Takım Başarıyla Oluşturuldu");
    return response.data;
  } catch (error) {
    toast.error(
      `Takım Oluşturulamadı: ${error.response?.data?.message || error.message}`
    );
    throw error;
  }
};

export const addUserToTeam = async (teamId, userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/teams/${teamId}/members/${userId}`
    );
    toast.success("Gönüllü Takıma Başarıyla Eklendi");
    return response.data;
  } catch (error) {
    toast.error(
      `Gönüllü Ekleme Hatası: ${error.response?.data?.message || error.message}`
    );
    throw error;
  }
};

export const handleEmergency = async (userId, teamId) => {
  try {
    const response = await axios.put(`${API_URL}/coordinate/handle-emergency`, {
      userId,
      teamId,
    });
    toast.success("Yardım Ekibi Gönderildi");
    return response.data;
  } catch (error) {
    toast.error(
      `Yardım Ekibi Gönderme hatası: ${
        error.response?.data?.message || error.message
      }`
    );
    throw error;
  }
};
