import * as React from "react";

import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./src/screens/Home";
import { FontAwesome5 } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import Add from "./src/screens/Add";
import Notification from "./src/screens/Notification";
// const Tab = createBottomTabNavigator();
import * as SecureStore from "expo-secure-store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignInScreen from "./src/screens/SignInScreen";
import { useNavigation } from "@react-navigation/native";
const Stack = createNativeStackNavigator();
const AuthContext = React.createContext();

function SignIn(props) {
  const navigation = useNavigation();
  const { signIn } = React.useContext(AuthContext);
  return <SignInScreen {...props} navigation={navigation} userLogin={signIn} />;
}
export default function App() {
  const HomeScreen = props => {
    const navigation = useNavigation();

    return (
      <Home
        {...props}
        navigation={navigation}
        logout={() => {
          dispatch({ type: "SIGN_OUT" });
        }}
      />
    );
  };

  // return (
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync("userToken");
      } catch (e) {}
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async data => {
        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" });
      },
    }),
    [],
  );

  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {state.userToken == null ? (
            <Stack.Screen name="SignIn" component={SignIn} />
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </AuthContext.Provider>
      <StatusBar style={"dark"} />
    </NavigationContainer>
  );
  // <NavigationContainer>
  //   <Tab.Navigator
  //     initialRouteName="Map"
  //     screenOptions={{
  //       tabBarShowLabel: false,
  //       headerShown: false,
  //     }}
  //   >
  //     <Tab.Screen
  //       name="Home"
  //       component={HomeScreen}
  //       options={{
  //         tabBarIcon: () => {
  //           return <FontAwesome5 name="compass" size={24} />;
  //         },
  //       }}
  //     />

  //     <Tab.Screen
  //       name="Add"
  //       component={Add}
  //       options={{
  //         tabBarIcon: ({ tintColor }) => {
  //           return (
  //             <View
  //               style={{
  //                 position: "absolute",
  //                 bottom: 10, // space from bottombar
  //                 height: 58,
  //                 width: 58,
  //                 borderRadius: 58,
  //                 backgroundColor: "#F5313A",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //               }}
  //             >
  //               <FontAwesome5 name="plus" size={24} color="white" />
  //             </View>
  //           );
  //         },
  //       }}
  //     />
  //     <Tab.Screen
  //       name="Notification"
  //       component={Notification}
  //       options={{
  //         tabBarIcon: () => {
  //           return <Octicons name="bell" size={24} />;
  //         },
  //       }}
  //     />
  //   </Tab.Navigator>
  //   <StatusBar style={"light"} />
  // </NavigationContainer>
  // );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
