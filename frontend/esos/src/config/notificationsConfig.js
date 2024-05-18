// src/config/notificationsConfig
import io from 'socket.io-client';
const socket = io(process.env.EXPO_PUBLIC_API_URL);
console.log("enc:",process.env.EXPO_PUBLIC_API_URL);
export default socket;