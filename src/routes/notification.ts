import PushNotificationController from "../modules/notifications/pushNotifications/controller";
import NotificationController from "../modules/notifications/controller";
const pushNotificationRoutes = [
  {
    method: "get",
    path: "push-notifications",
    controller: PushNotificationController.get,
    authorization: true,
    authCheckType: ["admin"],
  },

  {
    method: "post",
    path: "push-notifications",
    controller: PushNotificationController.create,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "push-notifications/:id",
    controller: PushNotificationController.delete,
    authorization: true,
    authCheckType: ["admin"],
  },

  {
    method: "get",
    path: "notifications",
    controller: NotificationController.get,
    authorization: true,
    authCheckType: ["admin",'user','public'],
  },
  {
    method: "post",
    path: "notifications/mark-all-read",
    controller: NotificationController.markAllRead,
    authorization: false,
  },
  {
    method: "get",
    path: "notifications/total-unread",
    controller: NotificationController.getTotalUnRead,
    authorization: false,
  },
  {
    method: "post",
    path: "notifications/send/test",
    controller: NotificationController.test,
    authorization: false,
  },
  {
    method: "patch",
    path: "notifications/:id",
    controller: NotificationController.update,
    authorization: false,
  },
];
export default pushNotificationRoutes;
