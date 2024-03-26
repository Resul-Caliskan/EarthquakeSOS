import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screens/Login/login";
import Register from "../screens/Register/register";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{ headerShown: false, animation: none }}
      >
        <Stack.Group>
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Register} />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen name="home" component={Login} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
