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
import { schedulePushNotification } from "../config/Notification";

export default class Task extends Component {
  state = {
    incomplete: [],
    completed: [],
  };
  getAllTasksHandler = async () => {
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
    this.state.incomplete.map(task => {
      var date = task.due_date.split(" ")[0];
      var day = new Date(date).getDay();

      schedulePushNotification(
        task.summary,
        task.desc,
        "Task Reminder",
        new Date(date),
        day + 1,
      );
    });
  };
  componentDidMount = async () => {
    this.getAllTasksHandler();
  };

  deleteTaskHandler = async id => {
    await axios.delete(`/task/${id}`).then(response => {
      this.getAllTasksHandler();
    });
  };
  checkTaskDoneHandler = async id => {
    var body = {
      completed: 1,
    };
    await axios
      .put(`/task/${id}`, body)
      .then(response => {
        this.getAllTasksHandler();
      })
      .catch(err => {
        console.log(err.response);
      });
  };
  unCheckTaskHandler = async id => {
    var body = {
      completed: 0,
    };
    await axios
      .put(`/task/${id}`, body)
      .then(response => {
        this.getAllTasksHandler();
      })
      .catch(err => {
        console.log(err.response);
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
              this.props.logout();
              // this.props.navigation.push("Home", { screen: "Add" });
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
          {this.state.incomplete.length !== 0 &&
            this.state.incomplete.map(task => {
              if (task.due_date) {
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

                var dueDate = date.toLocaleString("en-us", options);
              }

              return (
                <ListItem.Swipeable
                  key={task.id}
                  rightContent={reset => (
                    <Button
                      title=""
                      onPress={() => {
                        this.deleteTaskHandler(task.id);
                        reset();
                      }}
                      icon={{ name: "delete", color: "white", size: 24 }}
                      buttonStyle={{
                        minHeight: "100%",
                        backgroundColor: "red",
                      }}
                    />
                  )}
                >
                  <Checkbox
                    color="#000"
                    onChange={() => {
                      this.checkTaskDoneHandler(task.id);
                    }}
                    flexDirection="row-reverse"
                    label=""
                    checkboxStyle={{
                      backgroundColor: "#FCFCFC",
                      borderColor: "#DADADA",
                    }}
                  />
                  <ListItem.Content>
                    <ListItem.Title>{task.summary}</ListItem.Title>
                    {task.due_date && (
                      <ListItem.Subtitle
                        style={{
                          marginTop: "3%",
                        }}
                      >
                        ⏰ {dueDate}
                      </ListItem.Subtitle>
                    )}
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
                    onPress={() => {
                      this.deleteTaskHandler(task.id);
                      reset();
                    }}
                    icon={{ name: "delete", color: "white" }}
                    buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
                  />
                )}
              >
                <Checkbox
                  color="#000"
                  onChange={() => {
                    this.unCheckTaskHandler(task.id);
                  }}
                  flexDirection="row-reverse"
                  label=""
                  initialValue={true}
                  checkboxStyle={{
                    backgroundColor: "#FCFCFC",
                    borderColor: "#DADADA",
                  }}
                  iconColor="#000"
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
