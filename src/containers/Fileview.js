import React from "react";
import Popup from "reactjs-popup";
import {
  matchImageResource16,
  matchImageResource128,
} from "../helpers/MatchImageResource";

export const FileView = (props) => {
  return (
    <div className={"file-view " + props.id}>
      <div className={"image-view " + props.id}>
        <img
          src={matchImageResource128(props)}
          alt={props.name}
          className={
            !props.type.includes("image")
              ? "icon " + props.id
              : "image " + props.id
          }
        />
      </div>
      <div className={"detail-view " + props.id}>
        <div className={"icon-box " + props.id}>
          <img
            src={matchImageResource16(props)}
            alt={props.name}
            className={"icon " + props.id}
          />
        </div>
        <div className={"text-box " + props.id}>
          <Popup
            trigger={
              <button className={"tooltip " + props.id}>{props.name}</button>
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
