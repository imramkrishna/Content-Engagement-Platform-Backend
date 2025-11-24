import Controller from "@/modules/news/controller";

const routes = [
  {
    method: "get",
    path: "news",
    controller: Controller.get,
  },
  {
    method: "post",
    path: "news",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "patch",
    path: "news/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "news/:id",
    controller: Controller.remove,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "get",
    path: "news/:id",
    controller: Controller.find,
  },
  {
    method: "patch",
    path: "news/status/:id",
    controller: Controller.updateStatus,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "post",
    path: "news/update-expired",
    controller: Controller.updateExpiredStatus,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;
