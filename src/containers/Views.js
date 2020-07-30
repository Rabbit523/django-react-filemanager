import React from "react";
import { withRouter } from "react-router-dom";
import Popup from "reactjs-popup";
import moment from "moment";
import { isMobileOnly } from "react-device-detect";
import {
  matchImageResource16,
  matchImageResource128,
} from "../helpers/MatchImageResource";

const FileView = (props) => {
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
        {isMobileOnly && props.id !== 0 && (
          <div
            className="info-box"
            id={"info-box file " + props.id + " detail"}
            onClick={() => props.onHandleSide()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20pt"
              viewBox="0 0 20 20"
              version="1.1"
              height="25pt"
            >
              <g id="surface1">
                <path
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#757575",
                    fillOpacity: 1,
                  }}
                  d="M 12 7.5 C 12 8.605469 11.105469 9.5 10 9.5 C 8.894531 9.5 8 8.605469 8 7.5 C 8 6.394531 8.894531 5.5 10 5.5 C 11.105469 5.5 12 6.394531 12 7.5 Z M 12 7.5 "
                ></path>
                <path
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#757575",
                    fillOpacity: 1,
                  }}
                  d="M 12 12.5 C 12 13.605469 11.105469 14.5 10 14.5 C 8.894531 14.5 8 13.605469 8 12.5 C 8 11.394531 8.894531 10.5 10 10.5 C 11.105469 10.5 12 11.394531 12 12.5 Z M 12 12.5 "
                ></path>
                <path
                  style={{
                    stroke: "none",
                    fillRule: "nonzero",
                    fill: "#757575",
                    fillOpacity: 1,
                  }}
                  d="M 12 17.5 C 12 18.605469 11.105469 19.5 10 19.5 C 8.894531 19.5 8 18.605469 8 17.5 C 8 16.394531 8.894531 15.5 10 15.5 C 11.105469 15.5 12 16.394531 12 17.5 Z M 12 17.5 "
                ></path>
              </g>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
export const FileViews = withRouter(FileView);

const ListView = (props) => {
  const cur_date = moment(new Date()).format("MMM DD, YYYY");
  const file_size = props.size;
  const extra_type_id =
    props.type === "folder" ? " folder " + props.id : " file " + props.id;
  const extra_id = props.access
    ? extra_type_id + " " + props.access
    : extra_type_id;
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
    <div
      className="list-view"
      id={"list-view" + extra_id}
      onDoubleClick={() =>
        props.type === "folder" &&
        !isMobileOnly &&
        props.history.push({
          pathname:
            props.location.pathname[props.location.pathname.length - 1] !== "/"
              ? `${props.location.pathname}/${props.name}`
              : `${props.location.pathname}${props.name}`,
          state: { name: props.name, id: props.id },
        })
      }
    >
      <div className="td-name" id={"td-name" + extra_id}>
        <div className="icon-box" id={"icon-box" + extra_id}>
          {props.type !== "folder" && (
            <img
              src={matchImageResource16(props)}
              alt={props.name}
              className="icon"
              id={"icon" + extra_id}
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
        <div className="text-box" id={"text-box" + extra_id}>
          <Popup
            trigger={
              <button className="tooltip" id={"tooltip" + extra_id}>
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
      {isMobileOnly && props.id !== 0 && (
        <div
          className="info-box"
          id={"info-box" + extra_type_id + " detail"}
          onClick={() => props.onHandleSide()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20pt"
            viewBox="0 0 20 20"
            version="1.1"
            height="25pt"
          >
            <g id="surface1">
              <path
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#757575",
                  fillOpacity: 1,
                }}
                d="M 12 7.5 C 12 8.605469 11.105469 9.5 10 9.5 C 8.894531 9.5 8 8.605469 8 7.5 C 8 6.394531 8.894531 5.5 10 5.5 C 11.105469 5.5 12 6.394531 12 7.5 Z M 12 7.5 "
              ></path>
              <path
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#757575",
                  fillOpacity: 1,
                }}
                d="M 12 12.5 C 12 13.605469 11.105469 14.5 10 14.5 C 8.894531 14.5 8 13.605469 8 12.5 C 8 11.394531 8.894531 10.5 10 10.5 C 11.105469 10.5 12 11.394531 12 12.5 Z M 12 12.5 "
              ></path>
              <path
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#757575",
                  fillOpacity: 1,
                }}
                d="M 12 17.5 C 12 18.605469 11.105469 19.5 10 19.5 C 8.894531 19.5 8 18.605469 8 17.5 C 8 16.394531 8.894531 15.5 10 15.5 C 11.105469 15.5 12 16.394531 12 17.5 Z M 12 17.5 "
              ></path>
            </g>
          </svg>
        </div>
      )}
      {!isMobileOnly && (
        <div className="td-owner" id={"td-owner" + extra_id}>
          <span>{props.owner ? props.owner : "me"}</span>
        </div>
      )}
      {!isMobileOnly && (
        <div className="td-modified" id={"td-modified" + extra_id}>
          <span>
            {props.last_modified ? dateFormat(props.last_modified) : cur_date}
          </span>
        </div>
      )}
      {!isMobileOnly && (
        <div className="td-size" id={"td-size" + extra_id}>
          <span>{props.size ? bytesToSize(file_size) : "_"}</span>
        </div>
      )}
    </div>
  );
};
export const ListViews = withRouter(ListView);

const FolderViews = (props) => {
  return (
    <div
      className="folder-view"
      id={"folder-view folder " + props.id}
      onDoubleClick={() => {
        !isMobileOnly &&
          props.history.push({
            pathname:
              props.location.pathname[props.location.pathname.length - 1] !==
              "/"
                ? `${props.location.pathname}/${props.name}`
                : `${props.location.pathname}${props.name}`,
            state: { name: props.name, id: props.id },
          });
      }}
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
      {isMobileOnly && props.id !== 0 && (
        <div
          className="info-box"
          id={"info-box folder " + props.id}
          onClick={() => props.onHandleSide()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20pt"
            viewBox="0 0 20 20"
            version="1.1"
            height="25pt"
          >
            <g id="surface1">
              <path
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#757575",
                  fillOpacity: 1,
                }}
                d="M 12 7.5 C 12 8.605469 11.105469 9.5 10 9.5 C 8.894531 9.5 8 8.605469 8 7.5 C 8 6.394531 8.894531 5.5 10 5.5 C 11.105469 5.5 12 6.394531 12 7.5 Z M 12 7.5 "
              ></path>
              <path
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#757575",
                  fillOpacity: 1,
                }}
                d="M 12 12.5 C 12 13.605469 11.105469 14.5 10 14.5 C 8.894531 14.5 8 13.605469 8 12.5 C 8 11.394531 8.894531 10.5 10 10.5 C 11.105469 10.5 12 11.394531 12 12.5 Z M 12 12.5 "
              ></path>
              <path
                style={{
                  stroke: "none",
                  fillRule: "nonzero",
                  fill: "#757575",
                  fillOpacity: 1,
                }}
                d="M 12 17.5 C 12 18.605469 11.105469 19.5 10 19.5 C 8.894531 19.5 8 18.605469 8 17.5 C 8 16.394531 8.894531 15.5 10 15.5 C 11.105469 15.5 12 16.394531 12 17.5 Z M 12 17.5 "
              ></path>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};

export default withRouter(FolderViews);
