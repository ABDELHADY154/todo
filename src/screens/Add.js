import React, { Component } from "react";
import { StyleSheet, View, Modal, KeyboardAvoidingView } from "react-native";
import { Input } from "@rneui/base";
import Icon from "react-native-vector-icons/Ionicons";
import { Icon as Iconn } from "@rneui/themed";
import { Button as ButtonGalio } from "galio-framework";
import DateTimePicker from "@react-native-community/datetimepicker";
import { axios } from "../config/Axios";

export default class Add extends Component {
  state = {
    open: false,
    date: null,
    toggleModal: false,
    summary: "",
    desc: "",
    summaryErr: "",
  };

  addTaskHandler = async () => {
    if (this.state.date) {
      var options = {
        hour12: false,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };

      var date = this.state.date
        .toLocaleDateString("zh-Hans-CN", options)
        .split("/")
        .join("-");

      var time = this.state.date.toLocaleTimeString("en-US", { hour12: false });
      var dateFormatted = `${date} ${time}`;
    }
    var body = {
      summary: this.state.summary,
      desc: this.state.summary,
      due_date: dateFormatted,
    };

    await axios
      .post("/task", body)
      .then(response => {
        this.props.navigation.push("Home", { screen: "Task" });
      })
      .catch(error => {
        if (error.response.data.errors.summary) {
          this.setState({ summaryErr: error.response.data.errors.summary });
        }
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <Input
            containerStyle={{
              height: "15%",
            }}
            disabledInputStyle={{ background: "#ddd" }}
            inputContainerStyle={{
              height: "100%",
              borderBottomColor: "#BDBDBD",
              opacity: 0.5,
            }}
            errorMessage={this.state.summaryErr}
            errorStyle={{}}
            errorProps={{}}
            labelStyle={{}}
            labelProps={{}}
            leftIcon={
              <Icon
                name="chatbubble-ellipses-outline"
                size={20}
                color="#575767"
              />
            }
            leftIconContainerStyle={{
              marginRight: "3%",
            }}
            rightIconContainerStyle={{}}
            placeholder="Summary"
            onChangeText={val => {
              this.setState({ summary: val });
            }}
            value={this.state.summary}
          />
          <Input
            containerStyle={{
              height: "25%",
            }}
            disabledInputStyle={{ background: "#ddd" }}
            inputContainerStyle={{
              height: "100%",
              borderBottomColor: "#BDBDBD",
              opacity: 0.5,
              paddingBottom: "10%",
            }}
            errorStyle={{}}
            errorProps={{}}
            labelStyle={{}}
            labelProps={{}}
            leftIcon={
              <Iconn
                name="align-right"
                type="feather"
                size={20}
                color="#575767"
              />
            }
            leftIconContainerStyle={{
              marginRight: "3%",
            }}
            rightIconContainerStyle={{}}
            placeholder="Description"
            onChangeText={val => {
              this.setState({ desc: val });
            }}
            value={this.state.desc}
          />
          <Input
            containerStyle={{
              height: "15%",
            }}
            disabledInputStyle={{ background: "#ddd" }}
            inputContainerStyle={{
              height: "100%",
              borderBottomColor: "#BDBDBD",
              opacity: 0.5,
            }}
            errorStyle={{}}
            errorProps={{}}
            labelStyle={{}}
            labelProps={{}}
            leftIcon={
              <Iconn name="clock" type="feather" size={20} color="#575767" />
            }
            leftIconContainerStyle={{
              marginRight: "3%",
            }}
            rightIconContainerStyle={{}}
            value={this.state.date ? this.state.date.toLocaleString() : ""}
            placeholder="Due date"
            onFocus={() => {
              this.setState({ toggleModal: !this.state.toggleModal });
            }}
          />
          <Modal animationType="slide" visible={this.state.toggleModal}>
            <View
              style={{
                height: "100%",
                justifyContent: "center",
              }}
            >
              <DateTimePicker
                mode="datetime"
                display="spinner"
                textColor="#000"
                value={this.state.date ? this.state.date : new Date()}
                onChange={(event, date) => {
                  this.setState({ date: date });
                }}
              />
              <ButtonGalio
                round
                style={{
                  alignSelf: "center",
                  marginTop: "15%",
                }}
                color="#000"
                size="large"
                loadingSize="small"
                onPress={() => {
                  this.setState({ toggleModal: !this.state.toggleModal });
                }}
              >
                Save
              </ButtonGalio>
              <ButtonGalio
                round
                // uppercase
                style={{
                  alignSelf: "center",
                  marginTop: "15%",
                }}
                color="#000"
                size="large"
                loadingSize="small"
                onPress={() => {
                  this.setState({ toggleModal: !this.state.toggleModal });
                }}
              >
                close
              </ButtonGalio>
            </View>
          </Modal>
          <ButtonGalio
            round
            style={{
              alignSelf: "center",
              marginTop: "15%",
            }}
            color="#000"
            size="large"
            loadingSize="small"
            onPress={this.addTaskHandler}
          >
            Save
          </ButtonGalio>
        </KeyboardAvoidingView>
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
