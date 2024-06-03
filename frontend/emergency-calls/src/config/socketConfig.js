import { io } from "socket.io-client";

// Sunucu URL'sini burada belirtiyoruz.
const SOCKET_URL = "https://earthquakesos.onrender.com"; // Bu URL'yi kendi sunucu URL'niz ile değiştirin

// Socket bağlantısını oluşturuyoruz
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // WebSocket protokolünü kullanmak istediğimizi belirtiyoruz
  reconnectionAttempts: 5,   // Yeniden bağlanma denemesi sayısını belirliyoruz
  reconnectionDelay: 1000,   // Yeniden bağlanma denemesi arasındaki gecikme süresini (ms) belirliyoruz
  forceNew: true             // Yeni bağlantı oluşturulmasını zorluyoruz
});

export default socket;
