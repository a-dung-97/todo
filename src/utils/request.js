import axios from "axios";
import { getToken } from "@/utils/auth";
import store from "../store/index";
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (store.getters.isAuth) {
      config.headers["Authorization"] = "Bearer " + getToken();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const { data } = response;
    return data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
