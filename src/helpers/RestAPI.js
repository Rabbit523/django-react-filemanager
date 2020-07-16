import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

export const getFiles = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BASE_URL}/api-upload/get/`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.warn(err);
        reject(err);
      });
  });
};

export const uploadFiles = (formData) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${BASE_URL}/api-upload/upload/`, formData)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.warn(err);
        reject(err);
      });
  });
};
