import Controller from "@/modules/dashboard/controller";
import type { IRoute } from ".";
import { commentController } from "@/modules/comments/controller";

const routes: IRoute[] = [
  {
    method: "post",
    path: "comment",
    controller: commentController.create,
    authorization: false,
    authCheckType: ["user"],
  },
  {
    method: "patch",
    path: "comment/:commentId",
    controller: commentController.update,
    authorization: true,
    authCheckType: ["user"],
  },
  {
    method: "delete",
    path: "comment/:commentId",
    controller: commentController.remove,
    authorization: true,
    authCheckType: ["user"],
  },
];

export default routes;
