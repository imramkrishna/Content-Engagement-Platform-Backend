import firebaseAdmin from "../../config/firebase";

interface NotificationPayload {
  tokens: string[];
  title: string;
  body: string;
  additionalData?: any;
  image?: string;
}

const getNotificationMessage = async (type: string, status: string) => {
  switch (type) {
    case "News":
      switch (status) {
        case "Published":
          return {
            title: "New Article",
            body: `New Article has been published`,
          };
      }
  }
};

const sendPushNotification = async ({
  tokens,
  title,
  body,
  additionalData = {},
  image,
}: NotificationPayload) => {
  const payload: any = {
    tokens: tokens,
    priority: "high",
    sound: "default",
    notification: {
      title: title,
      body: body,
      ...(image && { image }),
    },
    android: {
      priority: "high",
      notification: {
        sound: "default",
        ...(image && { image }),
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
        },
      },
      fcmOptions: {
        ...(image && { image }),
      },
    },
    data: {
      additionalData: JSON.stringify({
        title: title,
        body: body,
        ...additionalData,
      }),
    },
  };
  if (!!image) {
    payload.notification.image = image;
  }
  if (!!tokens?.length) {
    await firebaseAdmin.messaging().sendEachForMulticast(payload);
  }
  return payload;
};

export default {
  sendPushNotification,
  getNotificationMessage,
};
