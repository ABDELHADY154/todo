import React, { Component } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Input } from "galio-framework";
import { Button } from "galio-framework";
import { Icon } from "react-native-elements";
import { axios } from "../config/Axios";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import * as SecureStore from "expo-secure-store";

export default class SignIn extends Component {
  state = {
    emailInput: "",
    passwordInput: "",
    emailErr: "",
    passwordErr: "",
    userData: {},

    loading: false,
    viewPass: false,
  };
  async storeConfig(config) {
    try {
      const jsonValue = JSON.stringify(config);
      await SecureStore.setItemAsync("config", jsonValue);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  async storeToken(token) {
    try {
      await SecureStore.setItemAsync("userToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  submit = () => {
    this.setState({
      emailErr: "",
      passwordErr: "",
      loading: true,
      passwordBorder: "",
      emailBorder: "",
    });
    var body = {
      email: this.state.emailInput,
      password: this.state.passwordInput,
    };

    axios
      .post("/login", body)
      .then(response => {
        this.setState({
          userData: response.data.response.data,
          emailErr: "",
          passwordErr: "",
          loading: false,
        });
        let config = {
          headers: {
            Authorization: "Bearer " + this.state.userData.token,
          },
        };
        this.storeConfig(config);
        this.storeToken(this.state.userData.token);
        this.props.userLogin(this.state.emailInput, this.state.passwordInput);
      })

      .catch(error => {
        this.setState({ loading: false });
        if (error.response) {
          if (error.response.data.errors) {
            this.setState({
              loading: false,
              emailErr: error.response.data.errors.email
                ? error.response.data.errors.email
                : error.response.data.errors.error,
              passwordErr: error.response.data.errors.password,
            });
          }
        }
      });
  };

  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#fff",
          flex: 1,
        }}
      >
        <View
          style={{
            width: "90%",
            flex: 1,
            alignSelf: "center",
            marginTop: "10%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Log In</Text>
            </View>

            <View style={styles.inputContainer}>
              <Input
                placeholder="Email"
                placeholderTextColor="#BDBDBD"
                type="email-address"
                bgColor="#F6F6F6"
                style={{ borderColor: "#E8E8E8", height: 50 }}
                // rounded
                onChangeText={e => {
                  this.setState({ emailInput: e });
                }}
              />
              {this.state.emailErr !== "" && (
                <Text
                  style={{
                    fontSize: 15,
                    color: "red",
                    alignSelf: "flex-start",
                  }}
                >
                  {this.state.emailErr}
                </Text>
              )}
            </View>
            <View style={styles.inputContainerPassword}>
              <Input
                placeholder="Password"
                placeholderTextColor="#BDBDBD"
                bgColor="#F6F6F6"
                style={{ borderColor: "#E8E8E8", height: 50 }} //
                password
                secureTextEntry={!this.state.viewPass}
                onChangeText={e => {
                  this.setState({ passwordInput: e });
                }}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: "5%",
                  top: this.state.passwordErr !== "" ? "28%" : "34%",
                }}
                onPress={() => {
                  this.setState({ viewPass: !this.state.viewPass });
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#000",
                    fontWeight: "500",
                  }}
                >
                  {this.state.viewPass == false ? "Show" : "Hide"}
                </Text>
              </TouchableOpacity>
              {this.state.passwordErr !== "" && (
                <Text
                  style={{
                    fontSize: 15,
                    color: "red",
                    alignSelf: "flex-start",
                  }}
                >
                  {this.state.passwordErr}
                </Text>
              )}
            </View>
            <Button
              round
              // uppercase
              style={{
                alignSelf: "center",
                marginTop: "15%",
              }}
              color="#000"
              size="large"
              loading={this.state.loading}
              loadingSize="small"
              onPress={this.submit}
            >
              Log In
            </Button>

            <TouchableOpacity
              style={{
                width: "100%",
                marginTop: "3%",
              }}
              onPress={() => {
                this.setState({ viewPass: !this.state.viewPass });
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#000",
                  fontWeight: "600",
                  alignSelf: "center",
                }}
              >
                Forget Password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  headerText: {
    color: "#000",
    fontSize: 30,
    alignSelf: "center",
    fontWeight: "600",
    lineHeight: 36,
  },
  inputContainer: {
    marginTop: "7%",

    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  inputContainerPassword: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  inputLabel: {
    fontSize: 20,
    marginBottom: "2%",
  },
});
