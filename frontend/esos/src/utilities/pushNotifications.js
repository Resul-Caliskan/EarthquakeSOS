// src/utilities/pushNotifications.js
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

export const sendPushNotification = async (data) => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.error("Permission to send push notification was not granted");
    return;
  }

  await Notifications.presentLocalNotificationAsync({
    title: "Notification",
    body: data.message,
    // You can customize other notification options here
  });
};
