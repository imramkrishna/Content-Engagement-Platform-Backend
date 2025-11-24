import { Notification } from "./model";
import NotificationRepository from "./repository";
import UserDeviceTokenService from "@/modules/userDeviceTokens/service";
import UserCategoriesService from "@/modules/userCategories/service";
import UserDeviceToken from "@/modules/userDeviceTokens/model";
import { Op } from "sequelize";

const repository = NotificationRepository;
const list = async (params: any) => {
  try {
    const user: any = await UserDeviceTokenService.find({
      sessionId: params?.sessionId,
    });

    const registeredUser: any = params?.user;

    if (!user?.id && !registeredUser?.id) {
      throw new Error("User not found");
    }

    const offset = (params.page - 1) * params.limit;

    const cutoffDate = !!registeredUser?.id
      ? new Date(registeredUser?.createdAt)
      : new Date(user?.createdAt);

    const filter: any = {
      offset,
      limit: params.limit,
      where: {
        createdAt: {
          [Op.gt]: cutoffDate,
        },
      },
      order: [["createdAt", "DESC"]],
    };

    if (params?.type) {
      filter.where.type = params.type;
    }

    if (params?.isRead) {
      filter.where.isRead = params.isRead === "true";
    }

    const data = await Notification.findAndCountAll(filter);

    return {
      items: data.rows,
      page: params.page,
      limit: params.limit,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / params.limit),
    };
  } catch (err: any) {
    throw new Error(err.message || err);
  }
};

const getTotalUnRead = async (params: any) => {
  try {
    const data = await Notification.count({
      where: {
        sessionId: params?.sessionId,
        isRead: false,
      },
    });
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const update = async (userId: number, id: number) => {
  try {
    const data: any = await Notification.findOne({
      where: {
        id,
        receiverId: userId,
      },
    });
    if (!data) {
      throw new Error("Notification not found");
    }
    if (data?.receiverId != userId) {
      throw new Error("Not authorized to update this notification");
    }
    data?.update({
      isRead: true,
    });
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const markAllRead = async (userId: number) => {
  try {
    await Notification.update(
      {
        isRead: true,
      },
      {
        where: {
          receiverId: userId,
          isRead: false,
        },
      }
    );
    return {};
  } catch (err: any) {
    throw new Error(err);
  }
};

const test = async (input: any) => {
  try {
    const tokens = [
      "eIAGt7gC4kUBo2nH0naeFQ:APA91bH44WhL5uIAS7GK9dspYpvQakhZPEWAaIPrRZd1eQ85ZyvRXG5OTh1TZ9-GLxP-9KYF5sQ5cGFIx6oRae0fz1jmpa4yN5L9QpxiOr49GeAa5ujITGw",
    ];
    const payload = {
      tokens: tokens,
      title: input?.title || "Test Push Notification",
      body: input?.body || "This is a test push notification.",
      additionalData: {
        moduleType: "Test",
      },
    };
    await repository.sendPushNotification(payload);
    return payload;
  } catch (err: any) {
    throw new Error(err);
  }
};

const sendToAllUsers = async (data: any) => {
  if (!!data?.title) {
    const categoryUsers = await UserCategoriesService.list({
      categoryId: data?.categoryId,
    });
    const userSessionIds = await Promise.all(
      categoryUsers.map((user: any) => user?.sessionId)
    );
    const users = await UserDeviceToken.findAll({
      where: {
        sessionId: userSessionIds,
      },
    });
    const tokens = users.map((user: any) => user?.deviceToken).flat();
    const payload = {
      title: data?.title,
      body: data?.body,
      type: "News",
      ...(data?.image && { image: data?.image }),
      additionalData: {
        id: data?.id,
        title: data?.title,
        body: data?.body,
      },
    };

    const notification = await Notification.create({
      receiverId: null,
      sessoinId: null,
      title: payload?.title,
      type: "News",
      additionalData: {
        id: data?.id,
      },
    });
    await repository.sendPushNotification({
      tokens: tokens,
      ...payload,
    });
    return notification;
  }
};
const send = async (
  data: any,
  type: string,
  status: string,
  receiverId: number,
  sessionId: string
) => {
  try {
    const user: any = await UserDeviceTokenService.find({
      sessionId: sessionId,
    });
    const message: any = await repository.getNotificationMessage(type, status);
    if (!!user?.deviceToken?.length) {
      const notification = await repository.sendPushNotification({
        tokens: user.deviceToken,
        ...message,
        additionalData: { ...data, moduleType: type },
      });
      await Notification.create({
        sessionId: sessionId,
        title: message?.title,
        body: message?.body,
        isRead: false,
        type: type,
        additionalData: {
          ...data,
          body: message?.body,
        },
      });
      return notification;
    }
  } catch (err: any) {
    throw new Error(err);
  }
};
export default {
  list,
  send,
  test,
  update,
  markAllRead,
  getTotalUnRead,
  sendToAllUsers,
};
