import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";
const PROD_BASE_URL = "http://18.133.54.86:8000";

export const getFiles = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${PROD_BASE_URL}/api-upload/get/`, {
        token: localStorage.getItem("token"),
      })
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
  formData.append("token", localStorage.getItem("token"));
  return new Promise((resolve, reject) => {
    axios
      .post(`${PROD_BASE_URL}/api-upload/upload/`, formData)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.warn(err);
        reject(err);
      });
  });
};

export const createFolder = (name) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${PROD_BASE_URL}/api/create/`, name)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.warn(err);
        reject(err);
      });
  });
};

export const getFolders = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${PROD_BASE_URL}/api/get/`, {
        token: localStorage.getItem("token"),
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.warn(err);
        reject(err);
      });
  });
};

export const uploadFolders = (formData, name) => {
  formData.append("token", localStorage.getItem("token"));
  formData.append("name", name);
  return new Promise((resolve, reject) => {
    axios
      .post(`${PROD_BASE_URL}/api/upload/`, formData)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.warn(err);
        reject(err);
      });
  });
};
