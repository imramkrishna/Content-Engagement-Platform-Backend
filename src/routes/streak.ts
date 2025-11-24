import { streakController } from "@/modules/streaks/controller";

const routes = [
  {
    method: "patch",
    path: "streak/update",
    controller: streakController.update,
    authorization: true,
    authCheckType: ["user", "public"],
  },
  {
    method: "get",
    path: "streak/:userId",
    controller: streakController.list,
    authorization: false,
  },
];

export default routes;
