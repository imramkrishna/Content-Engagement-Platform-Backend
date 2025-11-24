import path from "path";
import fs from "fs";
import { ROOT_PATH } from "@/constant";
const removeFile = async ({ filePath }: { filePath: string }) => {
  try {
    if (!!filePath) {
      const removePath = path.join(ROOT_PATH, "../", filePath);
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
        }
        fs.unlink(removePath, () => {
          return filePath;
        });
      });
    }
    return filePath;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default removeFile;
