import bucket from "./config/bucket";
import env from "./config/env";

bucket.listen(env.BUCKET_PORT, () => {
  console.log(`Bucket is running at ${env.BUCKET_PORT}`);
});
