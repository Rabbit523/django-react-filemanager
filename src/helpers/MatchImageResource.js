import { imageGroup16, imageGroup128 } from "./ImageGroup";

export const matchImageResource16 = (file) => {
  return file.type.includes("image")
    ? imageGroup16.image
    : file.type.includes("sheet") || file.type.includes("csv")
    ? imageGroup16.spreadsheet
    : file.type.includes("powerpoint") || file.type.includes("presentation")
    ? imageGroup16.powerpoint
    : file.type.includes("pdf")
    ? imageGroup16.pdf
    : file.type.includes("document")
    ? imageGroup16.doc
    : file.type.includes("rar") ||
      file.type.includes("zip") ||
      file.type.includes("compressed")
    ? imageGroup16.archive
    : file.type.includes("video")
    ? imageGroup16.video
    : file.type.includes("audio")
    ? imageGroup16.audio
    : file.type.includes("text") ||
      file.type.includes("x-javascript") ||
      file.type.includes("json")
    ? imageGroup16.text
    : file.type.includes("shellscript") ||
      file.type.includes("sql") ||
      file.type.includes("ca-cert")
    ? imageGroup16.shellscript
    : file.type.includes("vnd.ms-wpl") ||
      file.type.includes("x-ms-dos-executable") ||
      file.type.includes("x-msi")
    ? imageGroup16.unkown
    : file.type.includes("x-msdos-program")
    ? imageGroup16.msdos
    : file.type.includes("exe")
    ? imageGroup16.exe
    : file.type.includes("file")
    ? imageGroup16.file
    : imageGroup16.file;
};

export const matchImageResource128 = (file) => {
  return file.type.includes("image")
    ? file.path
    : file.type.includes("sheet") || file.type.includes("csv")
    ? imageGroup128.spreadsheet
    : file.type.includes("powerpoint") || file.type.includes("presentation")
    ? imageGroup128.powerpoint
    : file.type.includes("pdf")
    ? imageGroup128.pdf
    : file.type.includes("document")
    ? imageGroup128.doc
    : file.type.includes("rar") ||
      file.type.includes("zip") ||
      file.type.includes("compressed")
    ? imageGroup128.archive
    : file.type.includes("video")
    ? imageGroup128.video
    : file.type.includes("audio")
    ? imageGroup128.audio
    : file.type.includes("text") ||
      file.type.includes("x-javascript") ||
      file.type.includes("json")
    ? imageGroup128.text
    : file.type.includes("shellscript") ||
      file.type.includes("sql") ||
      file.type.includes("ca-cert")
    ? imageGroup128.shellscript
    : file.type.includes("vnd.ms-wpl") ||
      file.type.includes("x-ms-dos-executable") ||
      file.type.includes("x-msi")
    ? imageGroup128.unkown
    : file.type.includes("x-msdos-program")
    ? imageGroup128.msdos
    : file.type.includes("exe")
    ? imageGroup128.exe
    : file.type.includes("file")
    ? imageGroup128.file
    : imageGroup128.file;
};
