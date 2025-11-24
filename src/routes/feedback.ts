import type { IRoute } from ".";
import { feedbackController } from "@/modules/feedback/controller";

const routes: IRoute[] = [
  {
    method: "post",
    path: "feedback",
    controller: feedbackController.create,
    authorization: false,
    authCheckType: ["user"],
  },
  {
    method: "get",
    path: "feedback",
    controller: feedbackController.listAll,
    authorization: false,
    authCheckType: ["admin", "user"],
  },
  {
    method: "get",
    path: "feedback/user/:userId",
    controller: feedbackController.listByUser,
    authorization: false,
    authCheckType: ["admin", "user"],
  },
  {
    method: "delete",
    path: "feedback/:id",
    controller: feedbackController.remove,
    authorization: false,
    authCheckType: ["admin", "user"],
  },
];

export default routes;
