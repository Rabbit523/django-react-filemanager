import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import {
  Sidebar,
  Icon,
  Menu,
  Dropdown,
  Dimmer,
  Segment,
  Loader,
  Input,
  Button,
  Label,
  TransitionablePortal,
  Form,
} from "semantic-ui-react";
import { isMobileOnly, isIOS } from "react-device-detect";
import ReactHoverObserver from "react-hover-observer";
import ReactLoading from "react-loading";
import Modal from "react-modal";
import Popup from "reactjs-popup";
import Downloader from "js-file-downloader";
import moment from "moment";
import { animated } from "react-spring";
import { useGesture } from "react-use-gesture";
import { animateScroll as scroll, Element, scroller } from "react-scroll";
import { toast } from "react-toastify";
import { useEventListener } from "../helpers/CustomHook";
import {
  getFiles,
  uploadFile,
  uploadFiles,
  createFolder,
  uploadFolder,
  getFolders,
  getSignedPostUrl,
  getMultiPartUploadId,
  uploadChunk,
  completeMultiUpload
} from "../helpers/RestAPI";
import { imageGroup128, imageGroup16 } from "../helpers/ImageGroup";
import { matchImageResource16 } from "../helpers/MatchImageResource";
import {
  availableUploadArea,
  availableDownloadArea,
} from "../helpers/AvailableArea";
import {
  FolderViews,
  FileViews,
  ListViews,
  UploadViews,
} from "../containers/Views";
import Layout from "../containers/Layout";
import Axios from "axios";

const CustomToast = ({ closeToast, text, type }) => {
  const onHandleCloseToast = () => {
    closeToast();
    scroll.scrollToBottom({ containerId: "context-area" });
  };
  return (
    <div className="custom-toast-body">
      <label>{text}</label>
      {type !== "download" || type !== "error" && <a onClick={onHandleCloseToast}>Locate</a>}
    </div>
  );
};
toast.configure();

export const Drive = (props) => {
  Modal.setAppElement("#root");
  const fileRef = useRef();
  const folderRef = useRef();
  const inputRef = useRef();

  const [is_page_loaded, setPageLoaded] = useState(false);
  const [is_uploadingModal, setUploadingModal] = useState(false);
  const [is_creatingModal, setCreatingModal] = useState(false);
  const [is_minimized, setMinimize] = useState(false);
  const [is_uploaded, setUploaded] = useState(false);
  const [is_context, setContext] = useState(true);
  const [is_triggerable, setContextTrigger] = useState(true);
  const [is_gridType, setViewType] = useState(true);
  const [is_mobilePopup, setMobilePopup] = useState(false);
  const [is_mobileSide, setMobileSide] = useState(false);
  const [order_desc, setOrder] = useState(true);
  const [file_count, setFileCount] = useState(0);
  const [total_file_count, setTotalFileCount] = useState(0);
  const [uploading_files, setUploadingFiles] = useState([]);
  const [uploading_folders, setUploadingFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [quick_files, setQuickFiles] = useState([
    {
      path: imageGroup128.getting_started,
      content_type: "image get_started",
      name: "Getting started",
      size: "",
      id: 0,
    },
  ]);
  const [quick_file, setQuickFile] = useState({});
  const [selected_file, setSelectedFile] = useState({});
  const [selected_folder, setSelectedFolder] = useState({});
  const [new_folder_title, setFolderTitle] = useState("Untitled folder");
  const [folders, setFolders] = useState([]);

  const CHUNK_SIZE = Math.pow(1024, 3);
  const CHUNK_LIMIT = 5 * Math.pow(1024, 2);
  const LIMIT = 6 * Math.pow(1024, 3);

  useEffect(() => {
    getFiles().then((res) => {
      if (res.length > 0) {
        const quick_arr = [];
        res.forEach((item, i) => {
          if (res.length > 5) {
            if (i > res.length - 6) {
              quick_arr.push(item);
            }
          } else {
            if (i < res.length) {
              quick_arr.push(item);
            }
          }
        });
        setQuickFiles(quick_arr);
        const file_arr = [
          {
            path: imageGroup128.getting_started,
            content_type: "image get_started",
            name: "Getting started",
            size: "",
            id: 0,
          },
        ].concat(res);
        setFiles(file_arr);
      } else {
        setFiles(res);
      }
      getFolders(0).then((res) => {
        setFolders(res);
        setPageLoaded(true);
      });
    });
  }, []);

  useEffect(() => {
    if (is_uploaded) {
      getFiles().then((res) => {
        if (uploading_files.length > 0) {
          for (let index = 0; index < uploading_files.length; index++) {
            for (let i = res.length - 1; i >= 0; i--) {
              if (res[i].name === uploading_files[index].name && parseInt(res[i].size) === parseInt(uploading_files[index].size)) {
                uploading_files[index].uploaded = true;
                break;
              }
            }
          }
          setUploadingFiles(uploading_files);
        }
        if (res.length > 0) {
          const quick_arr = [];
          res.forEach((item, i) => {
            if (res.length > 5) {
              if (i > res.length - 6) {
                quick_arr.push(item);
              }
            } else {
              if (i < res.length) {
                quick_arr.push(item);
              }
            }
          });
          setQuickFiles(quick_arr);
          const file_arr = [
            {
              path: imageGroup128.getting_started,
              content_type: "image get_started",
              name: "Getting started",
              size: "",
              id: 0,
            },
          ].concat(res);
          setFiles(file_arr);
        } else {
          setFiles(res);
        }
        getFolders(0).then((res) => {
          if (uploading_folders.length > 0) {
            for (let index = 0; index < uploading_folders.length; index++) {
              for (let i = res.length - 1; i >= 0; i--) {
                if (res[i].name === uploading_folders[index].name) {
                  uploading_folders[index].uploaded = true;
                  break;
                }
              }
            }
            setUploadingFolders(uploading_folders);
          }
          setFolders(res);
          setPageLoaded(true);
        });
      });
    }
  }, [is_uploaded]);

  useEffect(() => {
    setTotalFileCount(total_file_count + file_count);
  }, [file_count]);

  const eventContextHandler = useCallback(
    (e) => {
      if (e.button === 2 && !isMobileOnly) {
        if (
          availableUploadArea.includes(e.target.id) ||
          availableUploadArea.includes(e.target.getAttribute("data-value"))
        ) {
          setContextTrigger(false);
          setContext(true);
        } else if (availableDownloadArea.includes(e.target.className)) {
          const cur = e.target.id.split(" ")[2];
          const type = e.target.id.split(" ")[1];
          const access = e.target.id.split(" ")[3]
            ? e.target.id.split(" ")[3]
            : "";
          if (cur !== "0") {
            setContextTrigger(false);
            setContext(false);
            if (type === "file") {
              setSelectedFolder({});
              if (access === "detail") {
                const file = files.find((file) => file.id === parseInt(cur));
                setSelectedFile(file);
                setQuickFile({});
              } else {
                const file = quick_files.find(
                  (file) => file.id === parseInt(cur)
                );
                setQuickFile(file);
                setSelectedFile({});
              }
            } else {
              setSelectedFile({});
              setQuickFile({});
              const folder = folders.find(
                (folder) => folder.id === parseInt(cur)
              );
              setSelectedFolder(folder);
            }
          } else {
            setContextTrigger(true);
            setSelectedFile({});
            setQuickFile({});
            setSelectedFolder({});
          }
        } else {
          setContextTrigger(true);
          setSelectedFile({});
          setQuickFile({});
          setSelectedFolder({});
        }
      } else {
        setContextTrigger(true);
      }
    },
    [is_context, files]
  );

  const handleSortOrder = useCallback(
    (e) => {
      setOrder(!order_desc);
      let ordered_files = [];
      let ordered_folders = [];
      if (order_desc) {
        ordered_files = files.sort((a, b) => a.name.localeCompare(b.name));
        ordered_folders = folders.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        ordered_files = files.sort((a, b) => b.name.localeCompare(a.name));
        ordered_folders = folders.sort((a, b) => b.name.localeCompare(a.name));
      }
      setFiles(ordered_files);
      setFolders(ordered_folders);
    },
    [order_desc, files, folders]
  );

  const handleDropdown = (type) => {
    if (type === "new_folder") {
      setCreatingModal(true);
    }
    if (type === "upload_file") {
      fileRef.current.click();
    }
    if (type === "upload_folder") {
      folderRef.current.directory = true;
      folderRef.current.webkitdirectory = true;
      folderRef.current.click();
    }
  };

  const handleClick = async (e, data) => {
    if (data.foo === "new_folder") {
      setCreatingModal(true);
    }
    if (data.foo === "upload_file") {
      fileRef.current.click();
    }
    if (data.foo === "upload_folder") {
      folderRef.current.directory = true;
      folderRef.current.webkitdirectory = true;
      folderRef.current.click();
    }
    if (data.foo === "download") {
      if (selected_file) {
        new Downloader({ url: selected_file.path })
          .then((res) => console.log(res))
          .catch((e) => console.warn(e));
      }
      if (quick_file) {
        new Downloader({ url: quick_file.path })
          .then((res) => console.log(res))
          .catch((e) => console.warn(e));
      }
    }
  };

  const onHandleUploadFileSelect = (file) => {
    const selected_file = files.find((ele, index) => ele.name === file.name);
    setSelectedFile(selected_file);
    const element_name = is_gridType ? selected_file.name + "_grid_file_" + selected_file.id : selected_file.name + "list_file_" + selected_file.id;
    scroller.scrollTo(element_name, {
      containerId: "context-area",
      duration: 1500,
      delay: 100,
      offset: 0,
      smooth: true,
    });
  };

  const waitUpload = async (chunk) => {
    let formData = new FormData();
    formData.append('file', chunk.file);
    formData.append('mpuId', chunk.mpuId);
    formData.append('partNo', chunk.partNo);
    formData.append('directory', chunk.directory);

    const res = await getSignedPostUrl(formData);
    const response = await uploadChunk(res.data.data.signed_url, chunk.data);

    let etag = response.data.headers['etag'];
    return {
      'ETag': etag.substring(1, etag.length - 1),
      'PartNumber': chunk.partNo
    };
  };

  const uploadChunks = async (chunks) => {
    let parts = [];

    let chunk = chunks[0];
    const promises = chunks.map(waitUpload);
    parts = await Promise.all(promises);

    const complete = await completeMultiUpload(chunk.file, chunk.directory, parts, chunk.mpuId, chunk.type, chunk.size);
    return complete.data;
  };

  const calculateChunks = (file) => {
    var minChunksCount = parseInt(file.size / CHUNK_SIZE);
    var result = file.size % CHUNK_SIZE < CHUNK_LIMIT ? minChunksCount : minChunksCount + 1;
    return result;
  };

  const handleChangeFile = async (e) => {
    var file_arr = [];

    let overLimit = false;
    Object.values(e.target.files).forEach((file) => {
      if (file.size > LIMIT) {
        toast.dark(
          <CustomToast
            text="The size is too big and it cannot be uploaded"
            type="error"
          />,
          {
            position: toast.POSITION.TOP_CENTER,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            className: "toast-custom",
          }
        );
        overLimit = true;
      }
      file.uploaded = false;
      file_arr.push(file);
    });
    if (overLimit) return;

    setUploadingFiles((uploading_files) => uploading_files.concat(file_arr));
    setFileCount(file_count + e.target.files.length);
    if (isMobileOnly) {
      scroll.scrollToTop({ containerId: "context-area" });
    } else {
      setUploadingModal(true);
    }
    setUploaded(false);

    let response = [];
    for (let file of file_arr) {

      if (file.size < CHUNK_LIMIT) {
        var formData = new FormData;
        formData.append('file', file);
        const fileResponse = await uploadFile(formData);
        response.push(fileResponse.data);
      }
      else {
        const chunkCounts = calculateChunks(file);
        let partNo = 1;
        const res = await getMultiPartUploadId(file.name, null);
        const mpuId = res.data.data.mpu_id;
        let chunks = [];
        let _offset = 0;
        while (partNo <= chunkCounts) {
          let readLength = CHUNK_SIZE;
          if (file.size - _offset - CHUNK_SIZE < CHUNK_LIMIT) {
            readLength = file.size - _offset;
          }
          var blob = file.slice(_offset, readLength + _offset);
          chunks.push({
            'file': file.name,
            'type': file.type,
            'size': file.size,
            'mpuId': mpuId,
            'partNo': partNo,
            'directory': null,
            'data': blob
          });
          _offset += readLength;
          partNo++;
        }
        const fileResponse = await uploadChunks(chunks);
        response.push(fileResponse.data);
      }
    }
    isMobileOnly && setUploadingFiles([]);
    let res_arr = [...files];
    response.forEach((file) => {
      res_arr.push(file);
    });
    setFiles(res_arr);
    setUploaded(true);
    setFileCount(0);
    if (isMobileOnly) {
      toast.dark(
        <CustomToast
          text="All pending uploads have completed"
          type="upload"
        />,
        {
          position: toast.POSITION.BOTTOM_CENTER,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          className: "toast-custom",
        }
      );
    }
  };

  const onHandleUploadFolderSelect = (folder) => {
    const selected_folder = folders.find(
      (ele, index) => ele.name === folder.name
    );
    setSelectedFolder(selected_folder);
    const element_name = is_gridType ? selected_folder.name + "_grid_folder_" + selected_folder.id : selected_folder.name + "_list_folder_" + selected_folder.id;
    scroller.scrollTo(element_name, {
      containerId: "context-area",
      duration: 1500,
      delay: 100,
      offset: 0,
      smooth: true,
    });
  };
  const handleChangeFolder = async (e) => {
    var formData = new FormData();
    var directory = "";
    Object.values(e.target.files).forEach((file) => {
      formData.append("file", file);
      directory = file.webkitRelativePath;
    });
    formData.append("directory", directory.split("/")[0]);
    formData.append("parent_id", 0);
    var arr = [];
    arr.push({
      name: directory.split("/")[0],
      count: e.target.files.length,
      uploaded: false,
    });
    setUploadingFolders((uploading_folders) => uploading_folders.concat(arr));
    setFileCount(file_count + 1);
    setUploadingModal(true);
    setUploaded(false);
    uploadFolder(formData).then((res) => {
      const arr = [];
      arr.push(res);
      setFolders((folders) => folders.concat(arr));
      setUploaded(true);
      setFileCount(0);
    });
  };

  const closeModal = () => {
    setUploadingModal(false);
    setTotalFileCount(0);
    setUploadingFiles([]);
    setUploadingFolders([]);
  };

  const minimizeModal = () => {
    setMinimize(!is_minimized);
  };

  const afterOpenCreateModal = (e) => {
    inputRef.current.focus();
    inputRef.current.select();
  };

  const closeCreateModal = () => {
    setCreatingModal(false);
  };

  const handleChangeLayout = () => {
    setViewType(!is_gridType);
  };

  const handleShowDetail = () => {
    console.log("Show Detail View");
  };

  const onHandleFolderTitle = (e) => {
    setFolderTitle(e.target.value);
  };
  const onCreateNewFolder = () => {
    createFolder(new_folder_title, 0).then((res) => {
      setCreatingModal(false);
      const arr = [];
      arr.push(res);
      setFolders((folders) => folders.concat(arr));
      setUploaded(true);
      setFolderTitle("Untitled folder");
      setSelectedFile({});
      setQuickFile({});
      setSelectedFolder(res);
    });
  };

  const onHandleMobilePopupOpen = () => {
    setMobilePopup(true);
  };
  const onHandleMobilePopupClose = () => {
    setMobilePopup(false);
  };
  const onHandleMobilePopupItem = (type) => {
    setMobilePopup(false);
    if (type === "upload") {
      fileRef.current.click();
    }
    if (type === "create_folder") {
      setCreatingModal(true);
    }
  };

  const onHandleMobileSideOpen = () => {
    setMobileSide(true);
  };
  const onHandleMobileSideClose = () => {
    setMobileSide(false);
  };
  const onHandleMobileSideItem = (type) => {
    setMobileSide(false);
    if (type === "download") {
      if (selected_file) {
        console.log(selected_file);
        new Downloader({
          url: selected_file.path,
          mobileDisabled: false,
          forceDesktopMode: true,
        })
          .then((res) =>
            toast.dark(
              <CustomToast
                text="1 item will be download. See notification for details"
                type="download"
              />,
              {
                position: toast.POSITION.BOTTOM_CENTER,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                className: "toast-custom",
              }
            )
          )
          .catch((e) => console.warn(e));
      }
    }
    if (type === "trash") {
      console.log(type);
    }
  };

  const bind = useGesture({
    onMouseDown: (e) => {
      if (e.button === 0) {
        setContextTrigger(true);
        if (isMobileOnly) {
          const cur = e.target.id.split(" ")[2];
          const type = e.target.id.split(" ")[1];
          const access = e.target.id.split(" ")[3];
          if (cur !== "0") {
            if (type === "file") {
              setSelectedFolder({});
              if (access === "detail") {
                const file = files.find((file) => file.id === parseInt(cur));
                setSelectedFile(file);
                setQuickFile({});
                if (!e.target.className.includes("info-box")) {
                  new Downloader({
                    url: file.path,
                    mobileDisabled: false,
                    forceDesktopMode: true,
                  })
                    .then((res) =>
                      toast.dark(
                        <CustomToast
                          text="1 item will be download. See notification for details"
                          type="download"
                        />,
                        {
                          position: toast.POSITION.BOTTOM_CENTER,
                          hideProgressBar: true,
                          closeOnClick: false,
                          pauseOnHover: true,
                          draggable: true,
                          className: "toast-custom",
                        }
                      )
                    )
                    .catch((e) => console.warn(e));
                }
              } else {
                const file = quick_files.find(
                  (file) => file.id === parseInt(cur)
                );
                setQuickFile(file);
                setSelectedFile({});
                new Downloader({
                  url: file.path,
                  mobileDisabled: false,
                  forceDesktopMode: true,
                })
                  .then((res) =>
                    toast.dark(
                      <CustomToast
                        text="1 item will be download. See notification for details"
                        type="download"
                      />,
                      {
                        position: toast.POSITION.BOTTOM_CENTER,
                        hideProgressBar: true,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        className: "toast-custom",
                      }
                    )
                  )
                  .catch((e) => console.warn(e));
              }
            } else {
              setSelectedFile({});
              setQuickFile({});
              const folder = folders.find(
                (folder) => folder.id === parseInt(cur)
              );
              setSelectedFolder(folder);
              if (!e.target.className.includes("info-box")) {
                props.history.push({
                  pathname:
                    props.location.pathname[
                      props.location.pathname.length - 1
                    ] !== "/"
                      ? `${props.location.pathname}/${folder.name}`
                      : `${props.location.pathname}${folder.name}`,
                  state: { name: folder.name, id: folder.id },
                });
              }
            }
          } else {
            setSelectedFile({});
            setSelectedFolder({});
            setQuickFile({});
          }
        } else {
          const cur = e.target.id.split(" ")[2];
          const type = e.target.id.split(" ")[1];
          const access = e.target.id.split(" ")[3]
            ? e.target.id.split(" ")[3]
            : "";
          if (type === "file") {
            setSelectedFolder({});
            if (access === "detail") {
              const file = files.find((file) => file.id === parseInt(cur));
              setSelectedFile(file);
              setQuickFile({});
            } else {
              const file = quick_files.find(
                (file) => file.id === parseInt(cur)
              );
              setQuickFile(file);
              setSelectedFile({});
            }
          } else {
            setSelectedFile({});
            setQuickFile({});
            const folder = folders.find(
              (folder) => folder.id === parseInt(cur)
            );
            setSelectedFolder(folder);
          }
        }
      } else {
        setContextTrigger(true);
      }
    },
  });

  const dateFormat = (date) => {
    return moment(date).format("MMM DD, YYYY");
  };

  useEventListener("mousedown", eventContextHandler);

  return (
    <Layout>
      {is_page_loaded ? (
        <div className="explorer-page">
          <Modal
            isOpen={is_uploadingModal}
            onRequestClose={closeModal}
            className="file-upload-modal"
            overlayClassName="file-upload-modal-overlay"
          >
            <div className="modal-header">
              <div className="loading-status">
                {!is_uploaded && (
                  <span>
                    Uploading {file_count} {file_count > 1 ? "items" : "item"}
                  </span>
                )}
                {is_uploaded && (
                  <span>
                    {total_file_count} &nbsp;
                    {total_file_count > 1 ? "uploads " : "upload "}
                    completed
                  </span>
                )}
              </div>
              <div className="btn-group">
                <Popup
                  trigger={
                    <button className="tooltip" onClick={minimizeModal}>
                      {!is_minimized ? (
                        <svg
                          x="0px"
                          y="0px"
                          width="14px"
                          height="14px"
                          viewBox="0 0 24 24"
                          focusable="false"
                        >
                          <path
                            fill="#FFFFFF"
                            d="M21.17,5.17L12,14.34l-9.17-9.17L0,8l12,12,12-12z"
                          ></path>
                        </svg>
                      ) : (
                          <svg
                            x="0px"
                            y="0px"
                            width="14px"
                            height="14px"
                            viewBox="0 0 24 24"
                            focusable="false"
                          >
                            <path
                              fill="#FFFFFF"
                              d="M2.83,18.83L12,9.66l9.17,9.17L24,16,12,4,0,16z"
                            ></path>
                          </svg>
                        )}
                    </button>
                  }
                  position="bottom center"
                  on="hover"
                  arrow={false}
                >
                  <span className="content">Minimize</span>
                </Popup>
                <Popup
                  trigger={
                    <button className="tooltip" onClick={closeModal}>
                      <svg
                        x="0px"
                        y="0px"
                        width="14px"
                        height="14px"
                        viewBox="0 0 10 10"
                        focusable="false"
                        fill="#FFFFFF"
                      >
                        <polygon points="10,1.01 8.99,0 5,3.99 1.01,0 0,1.01 3.99,5 0,8.99 1.01,10 5,6.01 8.99,10 10,8.99 6.01,5 "></polygon>
                      </svg>
                    </button>
                  }
                  position="bottom center"
                  on="hover"
                  arrow={false}
                >
                  <span className="content">Close</span>
                </Popup>
              </div>
            </div>
            {!is_minimized && (
              <div
                className={
                  total_file_count > 10 ? "modal-body extra" : "modal-body"
                }
              >
                {Object.values(uploading_files).map((file, i) => (
                  <div className="item" key={i}>
                    <div className="content">
                      <div className={!file.uploaded ? "logo loading" : "logo"}>
                        <img src={matchImageResource16(file)} alt={file.name} />
                      </div>
                      <div className={!file.uploaded ? "name loading" : "name"}>
                        <span>{file.name}</span>
                        <span></span>
                      </div>
                      <div className="status">
                        {!file.uploaded ? (
                          <ReactLoading
                            type="spin"
                            color="#929292"
                            className="loading"
                          />
                        ) : (
                            <div className="icon">
                              <ReactHoverObserver>
                                {({ isHovering }) => (
                                  <React.Fragment>
                                    {isHovering ? (
                                      <svg
                                        width="24px"
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        focusable="false"
                                        onClick={() =>
                                          onHandleUploadFileSelect(file)
                                        }
                                      >
                                        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"></path>
                                      </svg>
                                    ) : (
                                        <svg
                                          width="24px"
                                          height="24px"
                                          viewBox="0 0 24 24"
                                          fill="#0F9D58"
                                        >
                                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                                        </svg>
                                      )}
                                  </React.Fragment>
                                )}
                              </ReactHoverObserver>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
                {Object.values(uploading_folders).map((folder, i) => (
                  <div className="item" key={i}>
                    <div className="content">
                      <div className={!folder.uploaded ? "logo loading" : "logo"}>
                        <svg
                          x="0px"
                          y="0px"
                          focusable="false"
                          viewBox="0 0 24 24"
                          height="24px"
                          width="24px"
                          fill="#5f6368"
                        >
                          <g>
                            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path>
                            <path d="M0 0h24v24H0z" fill="none"></path>
                          </g>
                        </svg>
                      </div>
                      <div className={!folder.uploaded ? "name loading" : "name"}>
                        <span>{folder.name}</span>
                        <span>
                          {!folder.uploaded ? 0 : folder.count} of {folder.count}
                        </span>
                      </div>
                      <div className="status">
                        {!folder.uploaded ? (
                          <ReactLoading
                            type="spin"
                            color="#929292"
                            className="loading"
                          />
                        ) : (
                            <div className="icon">
                              <ReactHoverObserver>
                                {({ isHovering }) => (
                                  <React.Fragment>
                                    {isHovering ? (
                                      <svg
                                        width="24px"
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        focusable="false"
                                        onClick={() =>
                                          onHandleUploadFolderSelect(folder)
                                        }
                                      >
                                        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"></path>
                                      </svg>
                                    ) : (
                                        <svg
                                          width="24px"
                                          height="24px"
                                          viewBox="0 0 24 24"
                                          fill="#0F9D58"
                                        >
                                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                                        </svg>
                                      )}
                                  </React.Fragment>
                                )}
                              </ReactHoverObserver>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal>
          <Modal
            isOpen={is_creatingModal}
            onRequestClose={closeCreateModal}
            onAfterOpen={afterOpenCreateModal}
            className="create-folder-modal"
            overlayClassName="modal-overlay"
          >
            <div className="modal-header">
              <span>New folder</span>
              <Popup
                trigger={
                  <button className="tooltip" onClick={closeCreateModal}>
                    <svg
                      x="0px"
                      y="0px"
                      width="14px"
                      height="14px"
                      viewBox="0 0 10 10"
                      focusable="false"
                      fill="#000000"
                    >
                      <polygon points="10,1.01 8.99,0 5,3.99 1.01,0 0,1.01 3.99,5 0,8.99 1.01,10 5,6.01 8.99,10 10,8.99 6.01,5 "></polygon>
                    </svg>
                  </button>
                }
                position="bottom center"
                on="hover"
                arrow={false}
              >
                <span className="content">Close</span>
              </Popup>
            </div>
            <div className="modal-body">
              <Input
                className="input"
                onChange={onHandleFolderTitle}
                defaultValue="Untitled folder"
                ref={inputRef}
              />
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={closeCreateModal}>
                Close
              </button>
              <button className="btn save" onClick={onCreateNewFolder}>
                Save
              </button>
            </div>
          </Modal>
          <ContextMenuTrigger id="context-menu" disable={is_triggerable}>
            <Sidebar as={Menu} vertical visible={true}>
              <Dropdown text="New" icon={null} labeled className="button-tool">
                <Dropdown.Menu>
                  <Dropdown.Item
                    icon="folder outline"
                    label="New folder"
                    onClick={() => handleDropdown("new_folder")}
                  ></Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    icon="upload"
                    label="Upload files"
                    onClick={() => handleDropdown("upload_file")}
                  ></Dropdown.Item>
                  <Dropdown.Item
                    icon="folder outline"
                    label="Upload folder"
                    onClick={() => handleDropdown("upload_folder")}
                  ></Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    icon="google"
                    label="Google Docs"
                    onClick={() => handleDropdown("google_docs")}
                  ></Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Menu.Item as={Link} exact to="/drive">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  fill="#000000"
                  focusable="false"
                >
                  <path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H5v-1h14v1zm0-3H5V4h14v13zm-9.35-2h5.83l1.39-2.77h-5.81zm7.22-3.47L13.65 6h-2.9L14 11.53zm-5.26-2.04l-1.45-2.52-3.03 5.51L8.6 15z"></path>
                </svg>
                <span>My Drive</span>
              </Menu.Item>
            </Sidebar>
            <div className="page-container">
              <div className="page-navbar">
                <div className="navbar-dropdown-menu">
                  <Dropdown text="My Drive" labeled className="navbar-dropdown">
                    <Dropdown.Menu>
                      <Dropdown.Item
                        icon="folder outline"
                        label="New folder"
                        onClick={() => handleDropdown("new_folder")}
                      ></Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        icon="upload"
                        label="Upload files"
                        onClick={() => handleDropdown("upload_file")}
                      ></Dropdown.Item>
                      <Dropdown.Item
                        icon="folder outline"
                        label="Upload folder"
                        onClick={() => handleDropdown("upload_folder")}
                      ></Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        icon="google"
                        label="Google Docs"
                        onClick={() => handleDropdown("google_docs")}
                      ></Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="navbar-mobile">
                  <Button
                    icon="bars"
                    labelPosition="left"
                    as={Link}
                    content="My Drive"
                  />
                </div>
                <div className="navbar-tools">
                  <button className="btn-layout" onClick={handleChangeLayout}>
                    {is_gridType ? (
                      <svg
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        focusable="false"
                        fill="#000000"
                      >
                        <path d="M3,5v14h18V5H3z M7,7v2H5V7H7z M5,13v-2h2v2H5z M5,15h2v2H5V15z M19,17H9v-2h10V17z M19,13H9v-2h10V13z M19,9H9V7h10V9z"></path>
                      </svg>
                    ) : (
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="#000000"
                        >
                          <path d="M2,5v14h20V5H2z M14,7v4h-4V7H14z M4,7h4v4H4V7z M16,11V7h4v4H16z M4,17v-4h4v4H4z M10,17v-4h4v4H10z M20,17 h-4v-4h4V17z"></path>
                          <path d="M0 0h24v24H0z" fill="none"></path>
                        </svg>
                      )}
                  </button>
                  <button className="btn-layout" onClick={handleShowDetail}>
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      fill="#000000"
                    >
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="context-area" id="context-area">
                {isMobileOnly && uploading_files.length > 0 && (
                  <div className="layout-view upload">
                    <div className="layout-content">
                      <div className="layout-header">
                        <h2>Uploads</h2>
                      </div>
                      <div className="main-content">
                        {uploading_files.map((item, i) => (
                          <div className="guesture">
                            <UploadViews key={i} file={item} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {files.length > 0 ? (
                  <div className="layout-view">
                    <div className="layout-content quick">
                      <div className="layout-header">
                        <h2>Quick Access</h2>
                      </div>
                      <div className="main-content">
                        {quick_files.map((item, i) => (
                          <animated.div
                            {...bind()}
                            className={
                              quick_file && item.id === quick_file.id
                                ? "guesture active"
                                : "guesture"
                            }
                            id={"guesture file " + item.id + " quick"}
                            key={i}
                          >
                            <FileViews
                              path={item.path}
                              type={item.content_type}
                              name={item.name}
                              id={item.id}
                              access="quick"
                            />
                          </animated.div>
                        ))}
                      </div>
                    </div>
                    {folders.length > 0 && (
                      <div
                        className={
                          is_gridType
                            ? "layout-content folder"
                            : "layout-content folder list"
                        }
                        id="layout-folder"
                      >
                        <div className="layout-header" id="folder-header">
                          <h2>Folders</h2>
                        </div>
                        <div className="main-content" id="folder-view">
                          {folders.map((item, i) => (
                            <animated.div
                              {...bind()}
                              className={
                                selected_folder &&
                                  item.id === selected_folder.id
                                  ? "guesture active"
                                  : "guesture"
                              }
                              data-value="guesture"
                              key={i}
                            >
                              <Element name={item.name + "_grid_folder_" + item.id}>
                                <FolderViews
                                  name={item.name}
                                  id={item.id}
                                  onHandleSide={onHandleMobileSideOpen}
                                />
                              </Element>
                            </animated.div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="layout-content file" id="layout-file">
                      <div className="layout-header" id="file-header">
                        {(is_gridType || (!is_gridType && isMobileOnly)) && (
                          <h2>Files</h2>
                        )}
                        {!is_gridType && !isMobileOnly && (
                          <div className="list-tool">
                            <div className="th-name">
                              <span>Name</span>
                              <button
                                class="direction"
                                onClick={handleSortOrder}
                              >
                                {order_desc ? (
                                  <svg
                                    width="18px"
                                    height="18px"
                                    viewBox="0 0 48 48"
                                    focusable="false"
                                    fill="#000000"
                                  >
                                    <path
                                      fill="none"
                                      d="M0 0h48v48H0V0z"
                                    ></path>
                                    <path d="M8 24l2.83 2.83L22 15.66V40h4V15.66l11.17 11.17L40 24 24 8 8 24z"></path>
                                  </svg>
                                ) : (
                                    <svg
                                      width="18px"
                                      height="18px"
                                      viewBox="0 0 48 48"
                                      focusable="false"
                                      fill="#000000"
                                    >
                                      <path
                                        fill="none"
                                        d="M0 0h48v48H0V0z"
                                      ></path>
                                      <path d="M40 24l-2.82-2.82L26 32.34V8h-4v24.34L10.84 21.16 8 24l16 16 16-16z"></path>
                                    </svg>
                                  )}
                              </button>
                            </div>
                            <div className="th-owner">
                              <span>Owner</span>
                            </div>
                            <div className="th-modified">
                              <span>Last modified</span>
                            </div>
                            <div className="th-size">
                              <span>File size</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="main-content" id="detail-view">
                        {is_gridType &&
                          files.map((item, i) => (
                            <animated.div
                              {...bind()}
                              className={
                                selected_file && item.id === selected_file.id
                                  ? "guesture active"
                                  : "guesture"
                              }
                              data-value="guesture"
                              key={i}
                            >
                              <Element name={item.name + "_grid_file_" + item.id}>
                                <FileViews
                                  path={item.path}
                                  type={item.content_type}
                                  name={item.name}
                                  id={item.id}
                                  access="detail"
                                  onHandleSide={onHandleMobileSideOpen}
                                />
                              </Element>
                            </animated.div>
                          ))}
                        {!is_gridType && (
                          <div className="list-group">
                            {!isMobileOnly &&
                              folders.map((item, i) => (
                                <animated.div
                                  {...bind()}
                                  className={
                                    selected_folder &&
                                      item.id === selected_folder.id
                                      ? "guesture active"
                                      : "guesture"
                                  }
                                  data-value="guesture"
                                  key={i}
                                >
                                  <Element name={item.name + "_list_folder_" + item.id}>
                                    <ListViews
                                      owner=""
                                      last_modified={item.modified_date}
                                      type="folder"
                                      name={item.name}
                                      size=""
                                      id={item.id}
                                      onHandleSide={onHandleMobileSideOpen}
                                    />
                                  </Element>
                                </animated.div>
                              ))}
                            {files.map((item, i) => (
                              <animated.div
                                {...bind()}
                                className={
                                  selected_file && item.id === selected_file.id
                                    ? "guesture active"
                                    : "guesture"
                                }
                                data-value="guesture"
                                key={i}
                              >
                                <Element name={item.name + "_list_file_" + item.id}>
                                  <ListViews
                                    owner=""
                                    last_modified={item.modified_date}
                                    type={item.content_type}
                                    name={item.name}
                                    size={item.size}
                                    id={item.id}
                                    access="detail"
                                    onHandleSide={onHandleMobileSideOpen}
                                  />
                                </Element>
                              </animated.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {isMobileOnly && (
                      <a
                        className="mobile-btn-add"
                        onClick={onHandleMobilePopupOpen}
                      />
                    )}
                  </div>
                ) : (
                    <div className="layout-view" id="quick-context-area">
                      {folders.length > 0 && (
                        <div
                          className={
                            is_gridType
                              ? "layout-content folder"
                              : "layout-content folder list"
                          }
                        >
                          <div className="layout-header">
                            <h2>Folders</h2>
                          </div>
                          <div className="main-content" id="folder-view">
                            {folders.map((item, i) => (
                              <animated.div
                                {...bind()}
                                className={
                                  selected_folder &&
                                    item.id === selected_folder.id
                                    ? "guesture active"
                                    : "guesture"
                                }
                                data-value="guesture"
                                key={i}
                              >
                                <FolderViews
                                  name={item.name}
                                  id={item.id}
                                  onHandleSide={onHandleMobileSideOpen}
                                />
                              </animated.div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="layout-content quick">
                        <div className="layout-header">
                          {is_gridType && <h2>Files</h2>}
                          {!is_gridType && (
                            <div className="list-tool">
                              <div className="td-name">
                                <span>Name</span>
                                <button
                                  class="direction"
                                  onClick={handleSortOrder}
                                >
                                  {order_desc ? (
                                    <svg
                                      width="18px"
                                      height="18px"
                                      viewBox="0 0 48 48"
                                      focusable="false"
                                      fill="#000000"
                                    >
                                      <path
                                        fill="none"
                                        d="M0 0h48v48H0V0z"
                                      ></path>
                                      <path d="M8 24l2.83 2.83L22 15.66V40h4V15.66l11.17 11.17L40 24 24 8 8 24z"></path>
                                    </svg>
                                  ) : (
                                      <svg
                                        width="18px"
                                        height="18px"
                                        viewBox="0 0 48 48"
                                        focusable="false"
                                        fill="#000000"
                                      >
                                        <path
                                          fill="none"
                                          d="M0 0h48v48H0V0z"
                                        ></path>
                                        <path d="M40 24l-2.82-2.82L26 32.34V8h-4v24.34L10.84 21.16 8 24l16 16 16-16z"></path>
                                      </svg>
                                    )}
                                </button>
                              </div>
                              <div className="td-owner">
                                <span>Owner</span>
                              </div>
                              <div className="td-modified">
                                <span>Last modified</span>
                              </div>
                              <div className="td-size">
                                <span>File size</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="main-content" id="quick-view">
                          {is_gridType &&
                            quick_files.map((item, i) => (
                              <div className="guesture">
                                <FileViews
                                  key={i}
                                  path={item.path}
                                  type={item.content_type}
                                  name={item.name}
                                  id={item.id}
                                />
                              </div>
                            ))}
                          {!is_gridType && (
                            <div className="list-group">
                              {quick_files.map((item, i) => (
                                <div className="guesture">
                                  <ListViews
                                    key={i}
                                    owner=""
                                    last_modified={item.modified_date}
                                    type={item.content_type}
                                    name={item.name}
                                    size={item.size}
                                    id={item.id}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {isMobileOnly && (
                        <a
                          className="mobile-btn-add"
                          onClick={onHandleMobilePopupOpen}
                        />
                      )}
                    </div>
                  )}
              </div>
              {isMobileOnly && (
                <React.Fragment>
                  {is_mobilePopup && (
                    <div className="mobile-side-overlay"></div>
                  )}
                  <TransitionablePortal
                    open={is_mobilePopup}
                    onClose={onHandleMobilePopupClose}
                  >
                    <Segment className="mobile-popup">
                      <div className="header">
                        <h3>Create new</h3>
                      </div>
                      <div className="body">
                        <div className="item-row">
                          <div
                            className="item"
                            onClick={() =>
                              onHandleMobilePopupItem("create_folder")
                            }
                          >
                            <div className="icon-box">
                              <Icon name="folder" />
                            </div>
                            <div className="name">
                              <Label>Folder</Label>
                            </div>
                          </div>
                          <div
                            className="item"
                            onClick={() => onHandleMobilePopupItem("upload")}
                          >
                            <div className="icon-box">
                              <Icon name="upload" />
                            </div>
                            <div className="name">
                              <Label>Upload</Label>
                            </div>
                          </div>
                          <div
                            className="item"
                            onClick={() => onHandleMobilePopupItem("scan")}
                          >
                            <div className="icon-box">
                              <Icon name="camera" />
                            </div>
                            <div className="name">
                              <Label>Scan</Label>
                            </div>
                          </div>
                        </div>
                        <div className="item-row">
                          <div
                            className="item"
                            onClick={() =>
                              onHandleMobilePopupItem("google_doc")
                            }
                          >
                            <div className="icon-box">
                              <img
                                src={imageGroup16.google_doc}
                                alt="google_doc"
                              />
                            </div>
                            <div className="name">
                              <Label>Google Docs</Label>
                            </div>
                          </div>
                          <div
                            className="item"
                            onClick={() =>
                              onHandleMobilePopupItem("google_sheet")
                            }
                          >
                            <div className="icon-box">
                              <img
                                src={imageGroup16.google_sheet}
                                alt="google_sheet"
                              />
                            </div>
                            <div className="name">
                              <Label>Google Sheets</Label>
                            </div>
                          </div>
                          <div
                            className="item"
                            onClick={() =>
                              onHandleMobilePopupItem("google_slide")
                            }
                          >
                            <div className="icon-box">
                              <img
                                src={imageGroup16.google_slide}
                                alt="google_slide"
                              />
                            </div>
                            <div className="name">
                              <Label>Google Slides</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Segment>
                  </TransitionablePortal>
                </React.Fragment>
              )}
              {isMobileOnly && (
                <React.Fragment>
                  {is_mobileSide && <div className="mobile-side-overlay"></div>}
                  <TransitionablePortal
                    open={is_mobileSide}
                    onClose={onHandleMobileSideClose}
                    transition={{ animation: "fade left", duration: 500 }}
                  >
                    <Segment className="mobile-side">
                      <div className="header">
                        {selected_file.name && (
                          <React.Fragment>
                            {selected_file.content_type.includes("image") ? (
                              <div className="image">
                                <div
                                  style={{
                                    backgroundImage: `url(${selected_file.path})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "cover",
                                    width: 30,
                                    height: 30,
                                  }}
                                />
                              </div>
                            ) : (
                                <div className="image">
                                  <img
                                    src={matchImageResource16({
                                      type: selected_file.content_type,
                                    })}
                                    alt={selected_file.name}
                                    className="icon"
                                  />
                                </div>
                              )}
                            <h3>{selected_file.name}</h3>
                          </React.Fragment>
                        )}
                        {selected_folder.name && (
                          <React.Fragment>
                            <div className="svg-box">
                              <svg
                                x="0px"
                                y="0px"
                                focusable="false"
                                viewBox="0 0 24 24"
                                height="24px"
                                width="24px"
                                fill="#5f6368"
                              >
                                <g>
                                  <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path>
                                  <path d="M0 0h24v24H0z" fill="none"></path>
                                </g>
                              </svg>
                            </div>
                            <h3>{selected_folder.name}</h3>
                          </React.Fragment>
                        )}
                      </div>
                      <div className="body">
                        <div className="detail">
                          <div className="item">
                            <label>Type</label>
                            <div className="info">
                              <p>
                                {selected_file.name
                                  ? selected_file.content_type
                                  : "Google Drive Folder"}
                              </p>
                            </div>
                          </div>
                          <div className="item">
                            <label>Location</label>
                            <div className="info">
                              <p>My Drive</p>
                            </div>
                          </div>
                          <div className="item">
                            <label>Created</label>
                            <div className="info">
                              <p>
                                {selected_file.name
                                  ? dateFormat(selected_file.created_date)
                                  : dateFormat(selected_folder.created_date)}
                              </p>
                            </div>
                          </div>
                          <div className="item">
                            <label>Modified</label>
                            <div className="info">
                              <p>
                                {selected_file.name
                                  ? dateFormat(selected_file.modified_date)
                                  : dateFormat(selected_folder.modified_date)}
                              </p>
                            </div>
                          </div>
                        </div>
                        {selected_file.name && (
                          <div className="tools">
                            {!isIOS && (
                              <div
                                className="item"
                                onClick={() =>
                                  onHandleMobileSideItem("download")
                                }
                              >
                                <div className="icon-box">
                                  <Icon name="download" />
                                </div>
                                <label>Download</label>
                              </div>
                            )}
                            <div
                              className="item"
                              onClick={() => onHandleMobileSideItem("trash")}
                            >
                              <div className="icon-box">
                                <Icon name="trash alternate" />
                              </div>
                              <label>Remove</label>
                            </div>
                          </div>
                        )}
                      </div>
                    </Segment>
                  </TransitionablePortal>
                </React.Fragment>
              )}
            </div>
            <ContextMenu
              id="context-menu"
              className={is_triggerable ? "context hide" : "context"}
            >
              {is_context ? (
                <React.Fragment>
                  <MenuItem data={{ foo: "new_folder" }} onClick={handleClick}>
                    <Icon name="folder outline" /> New folder
                  </MenuItem>
                  <MenuItem divider />
                  <MenuItem data={{ foo: "upload_file" }} onClick={handleClick}>
                    <Icon name="upload" /> Upload files
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleChangeFile}
                      ref={fileRef}
                    />
                  </MenuItem>
                  <MenuItem
                    data={{ foo: "upload_folder" }}
                    onClick={handleClick}
                  >
                    <Icon name="folder outline" /> Upload folder
                    <input
                      type="file"
                      hidden
                      multiple
                      webkitdirectory
                      onChange={handleChangeFolder}
                      ref={folderRef}
                    />
                  </MenuItem>
                  <MenuItem divider />
                  <MenuItem data={{ foo: "google_doc" }} onClick={handleClick}>
                    <Icon name="google" /> Google Docs
                  </MenuItem>
                </React.Fragment>
              ) : (
                  <React.Fragment>
                    <MenuItem data={{ foo: "download" }} onClick={handleClick}>
                      <Icon name="cloud download" /> Download
                  </MenuItem>
                  </React.Fragment>
                )}
            </ContextMenu>
          </ContextMenuTrigger>
        </div>
      ) : (
          <Segment className="page-loader">
            <Dimmer active inverted>
              <Loader size="large"></Loader>
            </Dimmer>
          </Segment>
        )}
    </Layout>
  );
};
