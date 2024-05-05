import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function scheduleNotification(data) {
  const alarmSound = new Audio.Sound();
  try {
    await alarmSound.loadAsync(require("../../assets/alarm.mp3"));
    await alarmSound.playAsync();
  } catch (error) {
    console.error("Alarm çalma hatası:", error);
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Deprem`,
      body: "Deprem Büyüklüğü:" + data,
      color: "red",
    },
    trigger: null,
  });
}
