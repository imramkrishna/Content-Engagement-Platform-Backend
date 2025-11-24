import path from "path";
import fs from "fs";
import sharp from "sharp";
import heicConvert from "heic-convert";
import { ROOT_PATH } from "@/constant";
const saveFile = async ({
  buffer,
  storePath,
}: {
  buffer: Buffer;
  storePath: string;
}) => {
  try {
    fs.writeFile(storePath, buffer, (err: any) => {
      if (err) throw new Error(err);
    });
    return storePath;
  } catch (err: any) {
    throw new Error(err);
  }
};

const uploadImage = async ({
  filePath,
  fileName,
  base64,
}: {
  filePath: string;
  fileName: string;
  base64: string;
}) => {
  try {
    const buffer: any = Buffer.from(base64, "base64");
    const name = fileName.split(".")[0];
    const extension = fileName.split(".").pop()?.toLowerCase();
    const folderPath = path.join(ROOT_PATH, "../uploads", filePath);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    if (extension === "heic" || extension === "heif") {
      const pngFileName = `${name}.png`;
      try {
        const formatBuffer = await sharp(buffer)
          .toFormat("png", { quality: 90 })
          .toBuffer();
        const pngFileName = `${name}.png`;
        await saveFile({
          buffer: formatBuffer,
          storePath: path.join(folderPath, pngFileName),
        });
      } catch (err) {
        const formatBuffer: any = await heicConvert({
          buffer,
          format: "PNG",
          quality: 0.9,
        });
        await saveFile({
          buffer: formatBuffer,
          storePath: path.join(folderPath, pngFileName),
        });
      }
      return `uploads/${filePath}/${pngFileName}`;
    } else {
      const webpFileName = `${name}.webp`;
      const formatBuffer = await sharp(buffer)
        .toFormat("webp", { quality: 90 })
        .toBuffer();
      await saveFile({
        buffer: formatBuffer,
        storePath: path.join(folderPath, webpFileName),
      });
      return `uploads/${filePath}/${webpFileName}`;
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

export default uploadImage;
