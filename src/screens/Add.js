import React, { Component } from "react";
import { Text, StyleSheet, View, useColorScheme, Button } from "react-native";

export default class Add extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Add!</Text>
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
