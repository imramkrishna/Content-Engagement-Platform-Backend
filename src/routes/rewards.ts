import Controller from "@/modules/rewards/controller";

const routes = [
  {
    method: "get",
    path: "rewards",
    controller: Controller.get,
  },
  {
    method: "get",
    path: "rewards/:id",
    controller: Controller.getById,
  },
  {
    method: "post",
    path: "rewards",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "patch",
    path: "rewards/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "rewards/:id",
    controller: Controller.remove,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "post",
    path: "rewards/update-expired",
    controller: Controller.updateExpiredStatus,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;
