import React from "react";
import Popup from "reactjs-popup";
import moment from "moment";
import {
  matchImageResource16,
  matchImageResource128,
} from "../helpers/MatchImageResource";

export const FileView = (props) => {
  return (
    <div className="file-view" id={"file-view " + props.id}>
      <div className="image-view" id={"image-view " + props.id}>
        <img
          src={matchImageResource128(props)}
          alt={props.name}
          className={!props.type.includes("image") ? "icon" : "image"}
          id={
            !props.type.includes("image")
              ? "icon " + props.id
              : "image " + props.id
          }
        />
      </div>
      <div className="detail-view" id={"detail-view " + props.id}>
        <div className="icon-box" id={"icon-box " + props.id}>
          <img
            src={matchImageResource16(props)}
            alt={props.name}
            className="icon"
            id={"icon " + props.id}
          />
        </div>
        <div className="text-box" id={"text-box " + props.id}>
          <Popup
            trigger={
              <button className="tooltip" id={"tooltip " + props.id}>
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

  return (
    <div className="list-view" id={"live-view " + props.id}>
      <div className="td-name" id={"td-name " + props.id}>
        <div className="icon-box" id={"icon-box " + props.id}>
          <img
            src={matchImageResource16(props)}
            alt={props.name}
            className="icon"
            id={"icon " + props.id}
          />
        </div>
        <div className="text-box" id={"text-box " + props.id}>
          <Popup
            trigger={
              <button className="tooltip" id={"tooltip " + props.id}>
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
      <div className="td-owner" id={"td-owner " + props.id}>
        <span>{props.owner ? props.owner : "me"}</span>
      </div>
      <div className="td-modified" id={"td-modified " + props.id}>
        <span>{props.last_modified ? props.last_modified : cur_date}</span>
      </div>
      <div className="td-size" id={"td-size " + props.id}>
        <span>{props.size ? bytesToSize(file_size) : "_"}</span>
      </div>
    </div>
  );
};

export const FolderView = (props) => {
  return (
    <div className="folder-view" id={"folder-view " + props.id}>
      <div className="icon-box" id={"icon-box " + props.id}>
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
      <div className="text-box" id={"text-box " + props.id}>
        <Popup
          trigger={
            <button className="tooltip" id={"tooltip " + props.id}>
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
  );
};
