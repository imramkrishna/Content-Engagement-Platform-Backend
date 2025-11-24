import { likeController } from "@/modules/likes/controller";
import type { IRoute } from ".";

const routes: IRoute[] = [
  {
    method: "post",
    path: "like",
    controller: likeController.create,
    authorization: true,
    authCheckType: ["user"],
  },
  {
    method: "delete",
    path: "like/:newsId",
    controller: likeController.remove,
    authorization: true,
    authCheckType: ["user"],
  },
];

export default routes;
