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
import * as Location from "expo-location";

export default class CheckIn extends Component {
  state = {
    incomplete: [],
    completed: [],
    location: { city: null, country: null, longitude: null, latitude: null },
    locations: [],
  };

  getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    let regionName = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    this.setState({
      location: {
        city: regionName[0].city,
        country: regionName[0].country,
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      },
    });
  };
  componentDidMount = async () => {
    this.getUserLocation();
    await axios.get("/checkin").then(response => {
      this.setState({ locations: response.data.response.data.locations });
    });
  };

  checkInHandler = async () => {
    var body = {
      country: this.state.location.country,
      city: this.state.location.city,
      long: this.state.location.longitude,
      lat: this.state.location.latitude,
    };
    await axios.post("/checkin", body).then(response => {
      axios.get("/checkin").then(response => {
        this.setState({ locations: response.data.response.data.locations });
      });
    });
  };

  editLocationHandler = async id => {
    var body = {
      country: this.state.location.country,
      city: this.state.location.city,
      long: this.state.location.longitude,
      lat: this.state.location.latitude,
    };
    await axios.put(`/checkin/${id}`, body).then(response => {
      axios.get("/checkin").then(response => {
        this.setState({ locations: response.data.response.data.locations });
      });
    });
  };

  deleteLocationHandler = async id => {
    await axios.delete(`/checkin/${id}`).then(response => {
      axios.get("/checkin").then(response => {
        this.setState({ locations: response.data.response.data.locations });
      });
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
              this.checkInHandler();
            }}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 18,
                color: "#575767",
              }}
            >
              + CheckIn
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
            Current location
          </Text>

          <ListItem>
            <Text>📍</Text>
            <ListItem.Content>
              {this.state.location.city && (
                <>
                  <ListItem.Title>
                    {this.state.location.city}, {this.state.location.country}
                  </ListItem.Title>

                  <ListItem.Subtitle style={{ color: "#B9B9BE" }}>
                    {this.state.location.longitude}° N,{" "}
                    {this.state.location.latitude}° E
                  </ListItem.Subtitle>
                </>
              )}
            </ListItem.Content>
          </ListItem>

          <Text
            style={{
              color: "#575767",
              fontWeight: "700",
              fontSize: 18,
              marginLeft: "2%",
              marginTop: "3%",
            }}
          >
            Previous locations
          </Text>
          {this.state.locations.length !== 0 &&
            this.state.locations.map(checkin => {
              return (
                <ListItem.Swipeable
                  key={checkin.id}
                  leftContent={reset => (
                    <Button
                      title=""
                      onPress={() => this.deleteLocationHandler(checkin.id)}
                      icon={{ name: "delete", color: "white", size: 24 }}
                      buttonStyle={{
                        minHeight: "100%",
                        backgroundColor: "red",
                      }}
                    />
                  )}
                  rightContent={reset => (
                    <Button
                      title=""
                      onPress={() => {
                        this.editLocationHandler(checkin.id);
                        reset();
                      }}
                      icon={{ name: "edit", color: "white" }}
                      buttonStyle={{
                        minHeight: "100%",
                        // backgroundColor: "red",
                      }}
                    />
                  )}
                >
                  <Text>📍</Text>
                  <ListItem.Content>
                    {this.state.location.city && (
                      <>
                        <ListItem.Title>
                          {checkin.city}, {checkin.country}
                        </ListItem.Title>

                        <ListItem.Subtitle style={{ color: "#B9B9BE" }}>
                          {checkin.long}° N, {checkin.lat}° E
                        </ListItem.Subtitle>
                      </>
                    )}
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
