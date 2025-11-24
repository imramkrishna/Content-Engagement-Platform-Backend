import type { IRoute } from ".";
import { adsController } from "@/modules/ads/controller";

const routes: IRoute[] = [
  {
    method: "post",
    path: "ads",
    controller: adsController.create,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "patch",
    path: "ads/:id",
    controller: adsController.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "patch",
    path: "ads/:id/status",
    controller: adsController.updateStatus,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "ads/:id",
    controller: adsController.remove,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "get",
    path: "ads",
    controller: adsController.list,
    authorization: false,
    authCheckType: ["admin", "user"],
  },
  {
    method: "get",
    path: "ads/:id",
    controller: adsController.find,
    authorization: false,
    authCheckType: ["admin", "user"],
  },
];

export default routes;
