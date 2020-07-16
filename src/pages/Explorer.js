import React, { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { Sidebar, Icon, Menu } from "semantic-ui-react";
import { isMobileOnly } from "react-device-detect";
import ReactHoverObserver from "react-hover-observer";
import ReactLoading from "react-loading";
import Modal from "react-modal";
import Popup from "reactjs-popup";
import { useEventListener } from "../helpers/CustomHook";
import { getFiles, uploadFiles } from "../helpers/RestAPI";
import { matchImageResource16 } from "../helpers/MatchImageResource";
import { FileView } from "../containers/Fileview";
import Layout from "../containers/Layout";

export const Explorer = () => {
  Modal.setAppElement("#root");
  const fileRef = useRef();
  const available_area = ["row", "react-contextmenu-wrapper", "context-area"];
  const [is_uploadingModal, setUploadingModal] = useState(false);
  const [is_minimized, setMinimize] = useState(false);
  const [is_uploaded, setUploaded] = useState(false);
  const [is_context, setContext] = useState(true);
  const [file_count, setFileCount] = useState(0);
  const [total_file_count, setTotalFileCount] = useState(0);
  const [uploading_files, setUploadingFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [selected_file, setSelectedFile] = useState({});

  useEffect(() => {
    getFiles().then((res) => {
      setFiles(res);
    });
  }, [is_uploaded]);

  useEffect(() => {
    setTotalFileCount(total_file_count + file_count);
  }, [file_count]);

  const eventHandler = useCallback(
    (e) => {
      if (e.button === 2 && !isMobileOnly) {
        if (available_area.includes(e.target.className)) {
          setContext(true);
        } else {
          setContext(false);
          const cur = e.target.className.split(" ")[1];
          const file = files.find((file) => file.id === parseInt(cur));
          setSelectedFile(file);
        }
      }
    },
    [is_context, files]
  );

  useEventListener("mousedown", eventHandler);

  const handleClick = (e, data) => {
    if (data.foo === "upload_file") {
      fileRef.current.click();
    }
    if (data.foo === "download") {
      if (selected_file) {
        const file_path = selected_file.path;
        var a = document.createElement("A");
        a.href = file_path;
        a.download = file_path.substr(file_path.lastIndexOf("/") + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  const handleChangeFile = async (e) => {
    var formData = new FormData();
    var file_arr = [];
    Object.values(e.target.files).forEach((file) => {
      formData.append("file", file);
      file_arr.push(file);
    });
    setUploadingFiles((uploading_files) => uploading_files.concat(file_arr));
    setFileCount(file_count + e.target.files.length);
    setUploadingModal(true);
    uploadFiles(formData).then((response) => {
      let res_arr = [...files];
      response.forEach((file) => {
        res_arr.push(file);
      });
      setFiles(res_arr);
      setUploaded(true);
      setFileCount(0);
    });
  };

  const closeModal = () => {
    setUploadingModal(false);
    setTotalFileCount(0);
    setUploadingFiles([]);
  };

  const minimizeModal = () => {
    setMinimize(!is_minimized);
  };

  return (
    <Layout>
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
                    <div className={!is_uploaded ? "logo loading" : "logo"}>
                      <img src={matchImageResource16(file)} alt={file.name} />
                    </div>
                    <div className={!is_uploaded ? "name loading" : "name"}>
                      <span>{file.name}</span>
                      <span></span>
                    </div>
                    <div className="status">
                      {!is_uploaded ? (
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
        <Sidebar as={Menu} vertical visible={true}>
          <Menu.Item as={Link} to="/explorer">
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
        <div className="context-area">
          <ContextMenuTrigger id="context-menu">
            {files.length > 0 ? (
              <div className="container">
                <div className="row">
                  {files.map((item, i) => (
                    <FileView
                      key={i}
                      path={item.path}
                      type={item.content_type}
                      name={item.name}
                      id={item.id}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </ContextMenuTrigger>

          <ContextMenu id="context-menu">
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
                <MenuItem data={{ foo: "upload_folder" }} onClick={handleClick}>
                  <Icon name="folder outline" /> Upload folder
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
        </div>
      </div>
    </Layout>
  );
};
