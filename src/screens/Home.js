import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  useColorScheme,
  Button,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";

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
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Home!</Text>
        <Button
          title="logout"
          onPress={() => {
            this.storeToken();
            this.props.logout();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
