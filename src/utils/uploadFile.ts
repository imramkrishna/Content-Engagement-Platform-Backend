import path from "path";
import fs from "fs";
import Constant from "./constant";
import ffmpeg from "fluent-ffmpeg";
import removeFile from "./removeFile";
import { ROOT_PATH } from "@/constant";
const saveFile = async ({
  buffer,
  storePath,
}: {
  buffer: Buffer;
  storePath: string;
}) => {
  try {
    await fs.promises.writeFile(storePath, buffer);
    return storePath;
  } catch (err: any) {
    throw new Error(err);
  }
};

const uploadFile = async ({
  filePath,
  fileName,
  base64,
}: {
  filePath: string;
  fileName: string;
  base64: string;
}) => {
  try {
    const buffer = Buffer.from(base64, "base64");
    const folderPath = path.join(ROOT_PATH, "../uploads", filePath);
    const tempFolderPath = path.join(ROOT_PATH, "../uploads", "temp");
    const splitFilename: any[] = fileName.split(".");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    if (Constant.videoValidationExtensions.includes(splitFilename.pop())) {
      if (!fs.existsSync(tempFolderPath)) {
        fs.mkdirSync(tempFolderPath, { recursive: true });
      }
      const tempPath = path.join(tempFolderPath, fileName);
      await saveFile({
        buffer: buffer,
        storePath: tempPath,
      });
      ffmpeg(tempPath)
        .fps(40)
        .videoCodec("libx264")
        .outputOptions(["-pix_fmt yuv420p", `-crf 37`, "-preset fast"])
        .on("end", () => {
          removeFile({
            filePath: `uploads/temp/${fileName}`,
          });
        })
        .on("error", () => {
          removeFile({
            filePath: `uploads/temp/${fileName}`,
          });
        })
        .save(path.join(folderPath, fileName));
    } else {
      await saveFile({
        buffer: buffer,
        storePath: path.join(folderPath, fileName),
      });
    }
    return `uploads/${filePath}/${fileName}`;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default uploadFile;
