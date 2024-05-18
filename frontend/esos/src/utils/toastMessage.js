const { ToastAndroid } = require("react-native");

export function showToast(message) {
  ToastAndroid.show(message, ToastAndroid.SHORT);
}
