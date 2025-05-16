// src/index.ts
import axios from "axios";
var baseURL = process.env.API_BASE_URL || "http://localhost:3000";
var apiClient = axios.create({
  baseURL,
  timeout: 3e4,
  headers: {
    "Content-Type": "application/json"
  }
});
var setAuthToken = (token) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
var removeAuthToken = () => {
  delete apiClient.defaults.headers.common["Authorization"];
};
var src_default = {
  apiClient,
  setAuthToken,
  removeAuthToken
};
export {
  apiClient,
  src_default as default,
  removeAuthToken,
  setAuthToken
};
