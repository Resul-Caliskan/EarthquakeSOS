// src/backgroundTasks/socketBackgroundTask.js
import { TaskManager } from "expo";
import { sendPushNotification } from "../utilities/pushNotifications";
import notificationsConfig from "../config/notificationsConfig";

const BACKGROUND_SOCKET_TASK = "BACKGROUND_SOCKET_TASK";

TaskManager.defineTask(BACKGROUND_SOCKET_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Socket background task error:", error);
    return;
  }
  if (data) {
    console.log("Received notification in background:", data);
    // Trigger push notification
    sendPushNotification(data);
  }
});

notificationsConfig.on("connect", () => {
  console.log("Socket connected");
});

export default notificationsConfig;
