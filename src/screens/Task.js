import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { axios } from "../config/Axios";

import * as SecureStore from "expo-secure-store";
import { Checkbox } from "galio-framework";

import { ListItem } from "@rneui/themed";
import { Button } from "react-native-elements";

export default class Task extends Component {
  state = {
    incomplete: [],
    completed: [],
  };
  componentDidMount = async () => {
    var userToken = await SecureStore.getItemAsync("userToken");
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    await axios
      .get("/task")
      .then(response => {
        this.setState({
          incomplete: response.data.response.data.incomplete,
          completed: response.data.response.data.completed,
        });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            alignSelf: "flex-start",
            marginLeft: "2%",
            marginBottom: "6%",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // this.props.navigation.navigate("Add");
              this.props.logout();
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 18,
                color: "#575767",
              }}
            >
              + Add new task
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{}}>
          <Text
            style={{
              color: "#575767",
              fontWeight: "700",
              fontSize: 18,
              marginLeft: "2%",
            }}
          >
            Incomplete
          </Text>
          {this.state.incomplete.map(task => {
            var options = {
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            };

            let date = new Date(
              task.due_date.split("-")[0] +
                "/" +
                task.due_date.split("-")[1] +
                "/" +
                task.due_date.split("-")[2],
            );
            let dueDate = date.toLocaleString("en-us", options);

            return (
              <ListItem.Swipeable
                key={task.id}
                leftContent={reset => (
                  <Button
                    title="Info"
                    onPress={() => reset()}
                    icon={{ name: "info", color: "white" }}
                    buttonStyle={{ minHeight: "100%" }}
                  />
                )}
                rightContent={reset => (
                  <Button
                    title=""
                    onPress={() => reset()}
                    icon={{ name: "delete", color: "white", size: 24 }}
                    buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
                  />
                )}
              >
                <Checkbox
                  color="#000"
                  onChange={() => {}}
                  flexDirection="row-reverse"
                  label=""
                />
                <ListItem.Content>
                  <ListItem.Title>{task.summary}</ListItem.Title>
                  <ListItem.Subtitle
                    style={{
                      marginTop: "3%",
                    }}
                  >
                    ⏰ {dueDate}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem.Swipeable>
            );
          })}
          <Text
            style={{
              color: "#575767",
              fontWeight: "700",
              fontSize: 18,
              marginLeft: "2%",
              marginTop: "3%",
            }}
          >
            Completed
          </Text>
          {this.state.completed.map(task => {
            return (
              <ListItem.Swipeable
                key={task.id}
                leftContent={reset => (
                  <Button
                    title="Info"
                    onPress={() => reset()}
                    icon={{ name: "info", color: "white" }}
                    buttonStyle={{ minHeight: "100%" }}
                  />
                )}
                rightContent={reset => (
                  <Button
                    title=""
                    onPress={() => reset()}
                    icon={{ name: "delete", color: "white" }}
                    buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
                  />
                )}
              >
                <Checkbox
                  color="#000"
                  onChange={() => {}}
                  flexDirection="row-reverse"
                  label=""
                  initialValue={true}
                  checkboxStyle={{
                    backgroundColor: "#FCFCFC",
                  }}
                  iconColor="#000"
                  disabled
                />
                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      color: "#B9B9BE",
                    }}
                  >
                    {task.summary}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem.Swipeable>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
