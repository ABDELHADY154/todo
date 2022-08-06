import React, { Component } from "react";
import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Task from "./Task";
import Add from "./Add";
import CheckIn from "./CheckIn";

import { FontAwesome5 } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
export default class Home extends Component {
  async storeToken() {
    try {
      await SecureStore.deleteItemAsync("userToken");
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Task"
        screenOptions={{
          tabBarShowLabel: true,
          headerShown: false,

          tabBarStyle: {
            backgroundColor: "#FAFAFA",
            height: 100,
          },
          tabBarLabelStyle: {
            color: "#000",
            fontWeight: "600",
            fontSize: 10,
          },
        }}
      >
        <Tab.Screen
          name="Task"
          component={Task}
          options={{
            headerShown: true,
            headerStyle: {
              height: 130,
              borderBottomWidth: 0,
              borderColor: "#fff",
            },

            headerTitleStyle: {
              color: "#000",
              fontWeight: "600",
              fontSize: 30,
            },
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            tabBarIcon: () => {
              return (
                <Foundation name="clipboard-notes" size={34} color="black" />
              );
            },
          }}
        />

        <Tab.Screen
          name="Add"
          component={Add}
          options={{
            tabBarIcon: ({ tintColor }) => {
              return (
                <View
                  style={{
                    height: 56,
                    width: 56,
                    marginTop: "15%",
                    borderRadius: 58,
                    backgroundColor: "#000",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome5 name="plus" size={24} color="white" />
                </View>
              );
            },
            tabBarLabel: "",
          }}
        />
        <Tab.Screen
          name="Location"
          component={CheckIn}
          options={{
            headerShown: true,
            headerStyle: {
              height: 130,
              borderBottomWidth: 0,
              borderColor: "#fff",
            },

            headerTitleStyle: {
              color: "#000",
              fontWeight: "600",
              fontSize: 30,
            },
            tabBarLabelStyle: {
              color: "#000",
              fontWeight: "600",
              fontSize: 10,
            },

            headerShadowVisible: false,
            headerBackTitleVisible: false,
            tabBarIcon: () => {
              return <EvilIcons name="location" size={34} color="black" />;
            },
          }}
        />
      </Tab.Navigator>
    );
  }
}
