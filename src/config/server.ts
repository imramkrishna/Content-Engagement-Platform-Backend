import { Elysia } from "elysia";
import corsOptions from "./cors";
import helmetOptions from "./helmet";
import checkApiKey from "@/middlewares/checkApiKey";
import { randomUUID } from "crypto";

const server: any = new Elysia({
  serve: {
    maxRequestBodySize: 1024 * 1024 * 100,
  },
});
server
  .use(corsOptions)
  .use(helmetOptions)
  .onBeforeHandle(async ({ set, request, cookie }: any) => {
    if (!cookie.guestId?.value) {
      const guestId = randomUUID();
      set.cookie.guestId = {
        value: guestId,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 20,
      };
    }

    await checkApiKey(request);
  })

  .get("/", () => {
    return {
      message: "Api is Working",
    };
  });

server.onError(({ error, set }: any) => {
  switch (error.message) {
    case "jwt expired":
      set.status = 401;
      break;
    case "jwt malformed":
      set.status = 401;
      break;
    case "Unauthorized":
      set.status = 401;
      break;
    case "UNAUTHORIZED":
      set.status = 401;
      break;
    case "Invalid API Key":
      set.status = 401;
      break;
    case "NOT_FOUND":
      set.status = 404;
      break;
    default:
      set.status = 500;
      break;
  }
  console.log(error.message, set.status);
  return {
    message: error.message.replaceAll("Error: ", "") || "Forbidden",
    success: false,
    statusCode: set.status,
  };
});

export default server;
