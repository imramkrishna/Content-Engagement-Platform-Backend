import Controller from "@/modules/admins/controller";
const routes = [
  {
    method: "get",
    path: "admins",
    controller: Controller.get,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "get",
    path: "admins/:id",
    controller: Controller.find,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "post",
    path: "admins",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "get",
    path: "admins/:id",
    controller: Controller.find,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "patch",
    path: "admins/change-password",
    controller: Controller.changePassword,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "post",
    path: "admins/login",
    controller: Controller.login,
  },
  {
    method: "post",
    path: "admins/logout",
    controller: Controller.logout,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "patch",
    path: "admins/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;
