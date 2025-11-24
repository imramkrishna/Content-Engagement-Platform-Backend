import { helmet } from "elysia-helmet";
const helmetOptions = helmet({
  contentSecurityPolicy: false,
  frameguard: { action: "deny" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

export default helmetOptions;
