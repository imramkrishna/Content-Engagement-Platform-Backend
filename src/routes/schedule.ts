import ScheduleController from "../modules/schedules/controller";

const routes = [
  {
    method: "post",
    path: "schedules/test",
    controller: ScheduleController.test,
    authorization: false,
  },
];

export default routes;
