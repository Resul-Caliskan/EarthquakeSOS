// import * as BackgroundFetch from "expo-background-fetch";
// import * as Notifications from "expo-notifications";
// import * as TaskManager from "expo-task-manager";
// import notificationsConfig from "../config/notificationsConfig";
// const taskName = "BACKGROUND_NOTIFICATION_TASK";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// async function scheduleNotification(data) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: `Deprem`,
//       body: "Deprem Büyüklüğü:" + data,
//     },
//     trigger: null,
//   });
// }

// const BACKGROUND_SOCKET_TASK = "BACKGROUND_SOCKET_TASK";

// TaskManager.defineTask(BACKGROUND_SOCKET_TASK, async ({ data, error }) => {
//   if (error) {
//     console.error("Socket background task error:", error);
//     return;
//   }
//   if (data) {
//     console.log("Received notification in background:", data);
//     // Trigger push notification
//     sendPushNotification(data);
//   }
// });

// notificationsConfig.on("connect", () => {
//   console.log("Socket connected");
  
// });

// // export async function registerBackgroundTask() {
// //   try {
// //     await BackgroundFetch.registerTaskAsync(taskName, {
// //       minimumInterval: 2 * 60, // 15 dakika çekeceğim
// //       stopOnTerminate: false,
// //       startOnBoot: true,
// //     });
// //     const now = Date.now();

// //     console.log(
// //       `Got background fetch call at date: ${new Date(now).toISOString()}`
// //     );
// //     console.log("task tanımladı");
// //     console.log("Arka plan görevi başarıyla kaydedildi");
// //   } catch (err) {
// //     console.log("Arka plan görevi kaydedilemedi", err);
// //   }
// // }

// // // TASK
// // TaskManager.defineTask(taskName, async ({ data, error }) => {
// //   if (error) {
// //     console.error("Background task error:", error);
// //     return;
// //   }

// //   const now = Date.now();
// //   console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
// //   console.log("Task completed");

// //   // Check if notificationsConfig is connected before adding event listener
// //   if (!notificationsConfig.connected) {
// //     notificationsConfig.on("connect", () => {
// //       console.log("Socket connected");
// //     });
// //   }

// //   // Check if data contains notification payload
// //   if (data) {
// //     console.log("Received notification data:", data);
// //     await scheduleNotification(data);
// //   }

// //   return BackgroundFetch.Result.NewData;
// // });

// // src/backgroundTasks/socketBackgroundTask.js
