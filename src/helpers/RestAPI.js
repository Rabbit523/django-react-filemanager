import axios from "axios";
import { config } from "../config";

export const getFiles = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.PROD_BASE_URL}/api-upload/get/`, {
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

export const getFilesByDirectory = (directory) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.PROD_BASE_URL}/api-upload/get-directory-files`, {
        token: localStorage.getItem("token"),
        directory,
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
      .post(`${config.PROD_BASE_URL}/api-upload/upload/`, formData)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.warn(err);
        reject(err);
      });
  });
};

export const createFolder = (name, parent_id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.PROD_BASE_URL}/api/create/`, {
        name,
        parent_id,
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

export const getAllFolders = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.PROD_BASE_URL}/api/get-all/`, {
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

export const getFolders = (parent_id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.PROD_BASE_URL}/api/get/`, {
        token: localStorage.getItem("token"),
        parent_id,
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

export const uploadFolder = (formData) => {
  formData.append("token", localStorage.getItem("token"));
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.PROD_BASE_URL}/api-upload/upload-folder/`, formData)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.warn(err);
        reject(err);
      });
  });
};
