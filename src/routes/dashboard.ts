import Controller from "@/modules/dashboard/controller";

const routes = [
  {
    method: "get",
    path: "dashboard",
    controller: Controller.get,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;
