import { imageGroup16, imageGroup128 } from "./ImageGroup";

export const matchImageResource16 = (props) => {
  return props.type.includes("get_started")
    ? imageGroup16.get_started
    : props.type.includes("image")
    ? imageGroup16.image
    : props.type.includes("sheet") || props.type.includes("csv")
    ? imageGroup16.spreadsheet
    : props.type.includes("powerpoint") || props.type.includes("presentation")
    ? imageGroup16.powerpoint
    : props.type.includes("pdf")
    ? imageGroup16.pdf
    : props.type.includes("document")
    ? imageGroup16.doc
    : props.type.includes("rar") ||
      props.type.includes("zip") ||
      props.type.includes("compressed")
    ? imageGroup16.archive
    : props.type.includes("video")
    ? imageGroup16.video
    : props.type.includes("audio")
    ? imageGroup16.audio
    : props.type.includes("text") ||
      props.type.includes("x-javascript") ||
      props.type.includes("json")
    ? imageGroup16.text
    : props.type.includes("shellscript") ||
      props.type.includes("sql") ||
      props.type.includes("ca-cert")
    ? imageGroup16.shellscript
    : props.type.includes("vnd.ms-wpl") ||
      props.type.includes("x-ms-dos-executable") ||
      props.type.includes("x-msi")
    ? imageGroup16.unkown
    : props.type.includes("x-msdos-program")
    ? imageGroup16.msdos
    : props.type.includes("exe")
    ? imageGroup16.exe
    : props.type.includes("octet-stream")
    ? imageGroup128.file
    : imageGroup16.file;
};

export const matchImageResource128 = (props) => {
  return props.type.includes("get_started")
    ? props.path
    : props.type.includes("image")
    ? props.path
    : props.type.includes("sheet") || props.type.includes("csv")
    ? imageGroup128.spreadsheet
    : props.type.includes("powerpoint") || props.type.includes("presentation")
    ? imageGroup128.powerpoint
    : props.type.includes("pdf")
    ? imageGroup128.pdf
    : props.type.includes("document")
    ? imageGroup128.doc
    : props.type.includes("rar") ||
      props.type.includes("zip") ||
      props.type.includes("compressed")
    ? imageGroup128.archive
    : props.type.includes("video")
    ? imageGroup128.video
    : props.type.includes("audio")
    ? imageGroup128.audio
    : props.type.includes("text") ||
      props.type.includes("x-javascript") ||
      props.type.includes("json")
    ? imageGroup128.text
    : props.type.includes("shellscript") ||
      props.type.includes("sql") ||
      props.type.includes("ca-cert")
    ? imageGroup128.shellscript
    : props.type.includes("vnd.ms-wpl") ||
      props.type.includes("x-ms-dos-executable") ||
      props.type.includes("x-msi")
    ? imageGroup128.unkown
    : props.type.includes("x-msdos-program")
    ? imageGroup128.msdos
    : props.type.includes("exe")
    ? imageGroup128.exe
    : props.type.includes("octet-stream")
    ? imageGroup128.file
    : imageGroup128.file;
};
