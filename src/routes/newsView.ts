import Controller from "../modules/newsViews/controller";
const routes = [
  {
    method: "get",
    path: "news-views",
    controller: Controller.get,
    authorization: true,
    authCheckType: ["user", "public"],
  },
  {
    method: "post",
    path: "news-views",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["user", "public"],
  },
  {
    method: "patch",
    path: "news-views/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["user", "public"],
  },
  {
    method: "delete",
    path: "news-views/:id",
    controller: Controller.remove,
    authorization: true,
    authCheckType: ["user", "public"],
  },
];

export default routes;
