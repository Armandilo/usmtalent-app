import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://usmtalent-app.onrender.com/api/",
  withCredentials: true,
});

// Add a request interceptor
newRequest.interceptors.request.use(
  (config) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.token) {
      config.headers.Authorization = `Bearer ${currentUser.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;
