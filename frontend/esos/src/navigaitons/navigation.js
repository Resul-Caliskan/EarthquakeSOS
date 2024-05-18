import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login/login";
import Home from "../screens/Home/home";
import RegisterScreen from "../screens/Register/register";
import ForgotPasswordScreen from "../screens/Login/forgotPassword";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function NavigationScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{ headerShown: false, animation: "flip" }}
      >
        <Stack.Group>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={RegisterScreen} />
          <Stack.Screen name="forgot" component={ForgotPasswordScreen} />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen name="home" component={Home} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
