import Controller from "../modules/bookmarks/controller";
const routes = [
  {
    method: "get",
    path: "bookmarks",
    controller: Controller.get,
    authorization: true,
    authCheckType: ["user", "public"],
  },
  {
    method: "post",
    path: "bookmarks",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["user", "public"],
  },
  {
    method: "patch",
    path: "bookmarks/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["user", "public"],
  },
  {
    method: "delete",
    path: "bookmarks/:id",
    controller: Controller.remove,
    authorization: true,
    authCheckType: ["user", "public"],
  },
];

export default routes;
