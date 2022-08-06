import Axios from "react-native-axios";

export const axios = Axios.create({
  baseURL: "http://localhost:8000/api",
});
