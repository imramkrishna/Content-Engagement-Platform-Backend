import Controller from "@/modules/otp/controller";

const routes = [
  {
    method: "post",
    path: "otp/send",
    controller: Controller.send,
  },
  {
    method: "post",
    path: "otp/resend",
    controller: Controller.resend,
  },
  {
    method: "post",
    path: "otp/verify",
    controller: Controller.verify,
  },
];

export default routes;
