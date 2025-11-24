import express from "express";
const bucket: any = express();
bucket.use("/uploads", express.static("./uploads"));

export default bucket;
