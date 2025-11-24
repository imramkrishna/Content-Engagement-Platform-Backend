import { pollController } from "@/modules/polls/controller";

const routes = [
  {
    method: "get",
    path: "polls",
    controller: pollController.list,
  },
  {
    method: "patch",
    path: "polls/answer/:id",
    controller: pollController.createAnswer,
  },
  {
    method: "get",
    path: "polls/result/:id",
    controller: pollController.getPollResult,
  },
  {
    method: "patch",
    path: "polls/status/:id",
    controller: pollController.updateStatus,
  },
];

export default routes;
