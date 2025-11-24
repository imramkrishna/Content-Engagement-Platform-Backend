const imageValidationExtensions = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "heic",
  "heif",
  "webp",
];

const mimeTypes: any = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  heic: "image/heic",
  heif: "image/heif",
  webp: "image/webp",
};
const videoValidationExtensions = ["mp4", "mkv", "avi", "mov", "wmv", "flv"];
const fileValidationExtensions = ["pdf", "docx"];
const bucketUrl = "https://gistfeed.com";

export default {
  videoValidationExtensions,
  imageValidationExtensions,
  mimeTypes,
  fileValidationExtensions,
  bucketUrl,
};
