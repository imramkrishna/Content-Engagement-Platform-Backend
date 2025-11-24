import Controller from "@/modules/categories/controller";

const routes = [
  {
    method: "get",
    path: "categories",
    controller: Controller.get,
  },
  {
    method: "post",
    path: "categories",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "patch",
    path: "categories/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "categories/:id",
    controller: Controller.remove,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;
