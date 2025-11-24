import jwt from "jsonwebtoken";
import env from "@/config/env";
import crypto from "crypto";
const generate = async (params: any) => {
  return await jwt.sign(params, env.JWT_SECRET, {
    expiresIn: "8760h",
  });
};

const verify = async (token: any) => {
  const secret = env.JWT_SECRET || "";
  const splitToken: any = token.split(" ").pop();
  const decoded: any = jwt.verify(splitToken, secret);
  if (!!decoded?.id) {
    return decoded;
  } else {
    return null;
  }
};

const generateTemp = async (params: any, minutes = 7) => {
  params.createdAt = new Date();
  params.createdAt.setMinutes(params.createdAt.getMinutes() + minutes);
  const jsonString = JSON.stringify(params);
  const encodedData = Buffer.from(jsonString).toString("base64");
  const signature = crypto
    .createHmac("sha256", `${env.JWT_SECRET}`)
    .update(encodedData)
    .digest("hex");
  return `${encodedData}.${signature}`;
};

const reverseTemp = async (token: string) => {
  const currenteDate = new Date();
  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }
  const [encodedData, providedSignature] = parts;
  const calculatedSignature = crypto
    .createHmac("sha256", `${env.JWT_SECRET}`)
    .update(encodedData)
    .digest("hex");
  if (calculatedSignature !== providedSignature) {
    return false;
  }
  const decodedData: any = Buffer.from(encodedData, "base64").toString("utf-8");
  const parse = JSON.parse(decodedData);
  if (currenteDate > new Date(parse.createdAt)) {
    return false;
  }
  return parse;
};

export default {
  generate,
  verify,
  generateTemp,
  reverseTemp,
};
