import Controller from "../modules/generalSettings/controller";

const routes = [
  {
    method: "post",
    path: "generalSettings",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "get",
    path: "generalSettings/group/:group",
    controller: Controller.getByGroup,
    authorization: false,
  },
  {
    method: "get",
    path: "generalSettings/key/:key",
    controller: Controller.getByKey,
    authorization: false,
  },
  {
    method: "patch",
    path: "generalSettings/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "generalSettings/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;
