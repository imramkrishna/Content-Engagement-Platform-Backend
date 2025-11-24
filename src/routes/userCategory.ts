import Controller from "../modules/userCategories/controller";
const routes = [
  {
    method: "get",
    path: "user-categories",
    controller: Controller.get,
  },
  {
    method: "post",
    path: "user-categories",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["user", "public"],
  },
  {
    method: "delete",
    path: "user-categories/:id",
    controller: Controller.remove,
    authorization: true,
    authCheckType: ["user", "public"],
  },
  {
    method: "get",
    path: "user-categories/find",
    controller: Controller.find,
    authorization: true,
    authCheckType: ["user", "public"],
  },
];

export default routes;
