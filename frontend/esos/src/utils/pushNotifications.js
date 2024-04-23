import messaging from '@react-native-firebase/messaging';

export const registerAppWithFCM = async () => {
  await messaging().registerDeviceForRemoteMessages();
};

export const handleFCMNotifications = (onNotificationReceived) => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notification opened by user:', remoteMessage);
    if (remoteMessage && remoteMessage.notification) {
      onNotificationReceived(remoteMessage.notification);
    }
  });
};
