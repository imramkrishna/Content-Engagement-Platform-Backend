import firebaseAdmin from "firebase-admin";
import fs from "fs";
import path from "path";
const configFilePath = path.resolve(
  process.cwd(),
  "src/config/pushNotification.json"
);
const credAdmin = fs.readFileSync(configFilePath, "utf8");
const serviceAccount = JSON.parse(credAdmin);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

export default firebaseAdmin;
