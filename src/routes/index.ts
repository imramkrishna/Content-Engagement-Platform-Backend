import checkAuthentication from "@/middlewares/checkAuthentication";
import adminRoutes from "./admin";
import categoryRoutes from "./category";
import newsRoutes from "./news";
import generalSettingRoutes from "./generalSetting";
import bookmarkRoutes from "./bookmark";
import userCategoriesRoutes from "./userCategory";
import newsViewsRoutes from "./newsView";
import pushNotificationRoutes from "./notification";
import scheduleRoutes from "./schedule";
import dashboardRoutes from "./dashboard";
import userDeviceTokens from "./userDeviceToken";
import userRoutes from "./user";
import otpRoutes from "./otp";
import streakRoutes from "./streak";
import commentRoutes from "./comments";
import likeRoutes from "./likes";
import pollRoutes from "./poll";
import feedbackRoutes from "./feedback";
import adsRoutes from "./ads";
import rewardsRoutes from "./rewards";
import preferencesRoutes from "./preference";
export interface IAuthRequest extends Request {
  query: any;
  params: any;
  body: any;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    type: string;
  };
}
export const routes = [
  ...adminRoutes,
  ...categoryRoutes,
  ...newsRoutes,
  ...generalSettingRoutes,
  ...bookmarkRoutes,
  ...userCategoriesRoutes,
  ...newsViewsRoutes,
  ...pushNotificationRoutes,
  ...userDeviceTokens,
  ...dashboardRoutes,
  ...scheduleRoutes,
  ...userRoutes,
  ...otpRoutes,
  ...streakRoutes,
  ...commentRoutes,
  ...likeRoutes,
  ...pollRoutes,
  ...feedbackRoutes,
  ...adsRoutes,
  ...rewardsRoutes,
  ...preferencesRoutes,
];

export interface IRoute {
  method: "get" | "post" | "put" | "delete" | "patch";
  path: string;
  controller: (req: Request | IAuthRequest) => Promise<any>;
  authorization?: boolean;
  authCheckType?: string[];
}

const routesInit = (app: any) => {
  app.get("api/proxy", async (req: any) => {
    const { query } = req;
    const fileUrl = query.url;
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    return new Response(response.body, {
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileUrl
          .split("/")
          .pop()}"`,
      },
    });
  });
  routes?.forEach((route) => {
    const { method, path, controller, authorization, authCheckType } = route as
      | IRoute
      | any;
    const handleAuthenticationMiddleware = !!authorization
      ? {
          beforeHandle: async (req: any) => {
            return await checkAuthentication(req, authCheckType);
          },
        }
      : {};

    app[method](
      `api/${path}`,
      async (req: Request | any) => {
        try {
          console.log(`api/${path}`);
          const data = await controller(req);

          return {
            data,
            message: "SUCCESS",
          };
        } catch (err: any) {
          throw new Error(err);
        }
      },
      handleAuthenticationMiddleware
    );
  });
};

export default routesInit;
