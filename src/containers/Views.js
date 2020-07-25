import React from "react";
import { withRouter } from "react-router-dom";
import Popup from "reactjs-popup";
import moment from "moment";
import {
  matchImageResource16,
  matchImageResource128,
} from "../helpers/MatchImageResource";

export const FileView = (props) => {
  const extra_id = props.access ? props.id + " " + props.access : props.id;
  const image_style = {
    backgroundImage: `url(${props.path})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    height: "auto",
  };
  return (
    <div className="file-view" id={"file-view file " + extra_id}>
      {props.type.includes("image") ? (
        <div
          className="image-view transparent"
          id={"image-view file " + extra_id}
        >
          <div
            className="image"
            id={"image file " + extra_id}
            style={image_style}
          />
        </div>
      ) : (
        <div className="image-view" id={"image-view file " + extra_id}>
          <img
            src={matchImageResource128(props)}
            alt={props.name}
            className="icon"
            id={"icon file " + extra_id}
          />
        </div>
      )}
      <div className="detail-view" id={"detail-view file " + extra_id}>
        <div className="icon-box" id={"icon-box file " + extra_id}>
          <img
            src={matchImageResource16(props)}
            alt={props.name}
            className="icon"
            id={"icon file " + extra_id}
          />
        </div>
        <div className="text-box" id={"text-box file " + extra_id}>
          <Popup
            trigger={
              <button className="tooltip" id={"tooltip file " + extra_id}>
                {props.name}
              </button>
            }
            position="top center"
            on="hover"
            arrow={false}
          >
            <div>{props.name}</div>
          </Popup>
        </div>
      </div>
    </div>
  );
};

export const ListView = (props) => {
  const cur_date = moment(new Date()).format("MMM DD, YYYY");
  const file_size = props.size;

  const bytesToSize = (bytes) => {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  };

  const dateFormat = (date) => {
    return moment(date).format("MMM DD, YYYY");
  };

  return (
    <div className="list-view" id={"live-view file " + props.id}>
      <div className="td-name" id={"td-name file " + props.id}>
        <div className="icon-box" id={"icon-box file " + props.id}>
          {props.type !== "folder" && (
            <img
              src={matchImageResource16(props)}
              alt={props.name}
              className="icon"
              id={"icon file " + props.id}
            />
          )}
          {props.type === "folder" && (
            <svg
              x="0px"
              y="0px"
              focusable="false"
              viewBox="0 0 16 16"
              height="16px"
              width="16px"
              fill="#5f6368"
            >
              <g>
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path>
                <path d="M0 0h16v16H0z" fill="none"></path>
              </g>
            </svg>
          )}
        </div>
        <div className="text-box" id={"text-box file " + props.id}>
          <Popup
            trigger={
              <button className="tooltip" id={"tooltip file " + props.id}>
                {props.name}
              </button>
            }
            position="top center"
            on="hover"
            arrow={false}
          >
            <div>{props.name}</div>
          </Popup>
        </div>
      </div>
      <div className="td-owner" id={"td-owner file " + props.id}>
        <span>{props.owner ? props.owner : "me"}</span>
      </div>
      <div className="td-modified" id={"td-modified file " + props.id}>
        <span>
          {props.last_modified ? dateFormat(props.last_modified) : cur_date}
        </span>
      </div>
      <div className="td-size" id={"td-size file " + props.id}>
        <span>{props.size ? bytesToSize(file_size) : "_"}</span>
      </div>
    </div>
  );
};

const FolderView = (props) => {
  return (
    <div
      className="folder-view"
      id={"folder-view folder " + props.id}
      onDoubleClick={() =>
        props.history.push({
          pathname: `/drive/${props.name}`,
          state: { name: props.name },
        })
      }
    >
      <div className="icon-box" id={"icon-box folder " + props.id}>
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
      <div className="text-box" id={"text-box folder " + props.id}>
        <Popup
          trigger={
            <button className="tooltip" id={"tooltip folder " + props.id}>
              {props.name}
            </button>
          }
          position="top center"
          on="hover"
          arrow={false}
          unselectable="on"
        >
          <div>{props.name}</div>
        </Popup>
      </div>
    </div>
  );
};

export default withRouter(FolderView);
