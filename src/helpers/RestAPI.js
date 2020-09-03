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

export const getSignedPostUrl = async (formData) => {
  formData.append("token", localStorage.getItem("token"));
  try {
    const result = await axios.post(`${config.PROD_BASE_URL}/api-upload/getsignedurl/`, formData);
    return { error: null, data: result };
  } catch (error) {
    return { error: error, data: null };
  }
};

export const uploadChunk = async (url, chunk) => {
  try {
    const result = await axios.put(url, chunk);
    return { error: null, data: result };
  } catch (error) {
    console.log(error);
    return { error: error, data: null };
  }

};

export const completeMultiUpload = async (file, directory, parts, uploadId, type, size) => {

  var formData = new FormData();
  // formData.append('parts', parts);
  formData.append('uploadId', uploadId);
  formData.append("token", localStorage.getItem("token"));
  formData.append("file", file);
  formData.append("type", type);
  formData.append("size", size);
  formData.append("directory", directory);

  formData.append('parts', JSON.stringify(parts));

  try {
    const result = await axios
      .post(`${config.PROD_BASE_URL}/api-upload/completeUpload/`, formData);
    return { error: null, data: result };
  } catch (error) {
    console.log(error);
    return { error: error, data: null };
  }
};

export const completeFolderUpload = async (directory, parentId) => {

  var formData = new FormData();
  formData.append('parentId', parentId);
  formData.append("token", localStorage.getItem("token"));
  formData.append("directory", directory);

  try {
    const result = await axios
      .post(`${config.PROD_BASE_URL}/api-upload/completeFolderUpload/`, formData);
    return { error: null, data: result };
  } catch (error) {
    console.log(error);
    return { error: error, data: null };
  }
};


export const getMultiPartUploadId = async (file, directory) => {

  var formData = new FormData();
  formData.append('file', file);
  formData.append('directory', directory);
  formData.append("token", localStorage.getItem("token"));

  try {
    const result = await axios
      .post(`${config.PROD_BASE_URL}/api-upload/initiateUpload/`, formData);
    return { error: null, data: result };
  } catch (error) {
    console.log(error);
    return { error: error, data: null };
  }
};

export const uploadFile = async (formData) => {

  formData.append("token", localStorage.getItem("token"));
  try {
    const result = await axios
      .post(`${config.PROD_BASE_URL}/api-upload/upload/`, formData)
    return { error: null, data: result };
  } catch (error) {
    console.log(error);
    return { error: error, data: null };
  }
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
