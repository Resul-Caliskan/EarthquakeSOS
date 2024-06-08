import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const API_URL = 'http://localhost:5000/api';

export const getUnassignedUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/web/users/unassigned`);
    // toast.success('Gönüllüler Başarıyla Listelelendi');
    return response.data;
  } catch (error) {
    toast.error(`Error fetching unassigned users: ${error.response?.data?.message || error.message}`);
    throw error;
  }
};

export const getTeams = async () => {
  try {
    const response = await axios.get(`${API_URL}/teams`);
    // toast.success('Takımlar Başarıyla Listelendi');
    return response.data;
  } catch (error) {
    toast.error(`Error fetching teams: ${error.response?.data?.message || error.message}`);
    throw error;
  }
};

export const createTeam = async (teamName) => {
  try {
    const response = await axios.post(`${API_URL}/teams`, { name: teamName });
    toast.success('Takım Başarıyla Oluşturuldu');
    return response.data;
  } catch (error) {
    toast.error(`Error creating team: ${error.response?.data?.message || error.message}`);
    throw error;
  }
};

export const addUserToTeam = async (teamId, userId) => {
  try {
    const response = await axios.post(`${API_URL}/teams/${teamId}/members/${userId}`);
    toast.success('Gönüllü Takıma Başarıyla Eklendi');
    return response.data;
  } catch (error) {
    toast.error(`Gönüllü Ekleme Hatası: ${error.response?.data?.message || error.message}`);
    throw error;
  }
};
