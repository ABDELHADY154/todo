import Axios from "react-native-axios";

export const axios = Axios.create({
  baseURL: "https://todolist-app-admin.herokuapp.com/api",
});
