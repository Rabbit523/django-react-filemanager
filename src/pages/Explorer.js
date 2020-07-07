import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { Sidebar, Icon, Menu } from "semantic-ui-react";
import axios from "axios";
import Modal from "react-modal";
import Popup from "reactjs-popup";

const ExplorerLayout = () => {
  Modal.setAppElement("#root");
  const fileRef = useRef();
  const [is_uploadingModal, setUploadingModal] = useState(false);
  const [is_minimized, setMinimize] = useState(false);
  const [is_uploaded, setUploaded] = useState(false);
  const [file_count, setFileCount] = useState(0);
  const [total_file_count, setTotalFileCount] = useState(0);

  useEffect(() => {
    setTotalFileCount(total_file_count + file_count);
  }, [file_count, total_file_count]);

  function handleClick(e, data) {
    if (data.foo === "upload_file") {
      fileRef.current.click();
    }
  }

  function handleChangeFile(e) {
    var formData = new FormData();
    Object.values(e.target.files).forEach((file, key) => {
      formData.append(key, file);
    });
    setFileCount(file_count + e.target.files.length);
    setUploadingModal(true);
    axios
      .post("http://127.0.0.1:8000/api/upload-files/", formData)
      .then((res) => {
        console.log(res);
        setUploaded(true);
        setFileCount(0);
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  function closeModal() {
    setUploadingModal(false);
    setTotalFileCount(0);
  }

  function minimizeModal() {
    setMinimize(!is_minimized);
  }

  return (
    <div className="explorer-page">
      <Modal
        isOpen={is_uploadingModal}
        onRequestClose={closeModal}
        className="file-upload-modal"
        overlayClassName="file-upload-modal-overlay"
      >
        <div className="modal-header">
          <div className="loading-status">
            {!is_uploaded && <span> Uploading {file_count} items </span>}
            {is_uploaded && (
              <span>
                {total_file_count} {total_file_count > 1 ? "uploads" : "upload"}
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
          <div className="modal-body">
            <p>uploaded file</p>
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
          <div></div>
        </ContextMenuTrigger>

        <ContextMenu id="context-menu">
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
        </ContextMenu>
      </div>
    </div>
  );
};
export default ExplorerLayout;
