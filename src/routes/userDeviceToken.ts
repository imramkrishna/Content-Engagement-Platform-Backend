import Controller from "../modules/userDeviceTokens/controller";
const routes = [
  {
    method: "get",
    path: "user-device-tokens",
    controller: Controller.get,
    authorization: true,
    authCheckType: ["user", "public"],
  },
  {
    method: "post",
    path: "user-device-tokens",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["user", "public"],
  },
  {
    method: "delete",
    path: "user-device-tokens",
    controller: Controller.remove,
    authorization: true,
    authCheckType: ["user", "public"],
  },
];

export default routes;
