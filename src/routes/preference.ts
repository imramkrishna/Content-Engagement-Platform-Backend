import { preferenceController } from "@/modules/preferences/controller";

const routes = [
  {
    method: "get",
    path: "preferences",
    controller: preferenceController.list,
    authorization: true,
    authCheckType: ["user"],
  },
];

export default routes;
