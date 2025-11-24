import type { IRoute } from "./index";
import Controller from "@/modules/user/controller";

const userRoutes = [
  {
    method: "get",
    path: "users",
    controller: Controller.get,
    authorization: false,
    authCheckType: ["admin"],
  },
  {
    method: "get",
    path: "users/:id",
    controller: Controller.find,
    authorization: true,
    authCheckType: ["admin", "user"],
  },
  {
    method: "post",
    path: "users/register",
    controller: Controller.create,
    authorization: false,
  },
  {
    method: "patch",
    path: "users/:id",
    controller: Controller.update,
    authorization: false,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "users/:id",
    controller: Controller.remove,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "post",
    path: "users/login",
    controller: Controller.login,
    authorization: false,
  },
  {
    method: "post",
    path: "users/logout",
    controller: Controller.logout,
    authorization: true,
    authCheckType: ["user"],
  },
  {
    method: "patch",
    path: "users/change-password",
    controller: Controller.changePassword,
    authorization: true,
    authCheckType: ["user"],
  },
  {
    method: "post",
    path: "users/forgot-password",
    controller: Controller.forgotPassword,
    authorization: false,
  },
  {
    method: "patch",
    path: "users/deactivate",
    controller: Controller.deactivate,
    authorization: true,
    authCheckType: ["user"],
  },
  {
    method: "patch",
    path: "users/activate",
    controller: Controller.activate,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default userRoutes;
