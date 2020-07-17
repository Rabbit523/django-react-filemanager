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
              ? "icon" + props.id
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
        <span>{props.size ? file_size : "1MB"}</span>
      </div>
    </div>
  );
};
