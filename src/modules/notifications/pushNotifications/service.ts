import uploadImage from "@/utils/uploadImage";
import { ERROR_MESSAGES } from "@/utils/messages";
import { Notification, PushNotification } from "../model";
import NotificationRepository from "../repository";
import validationSchema from "../validationSchema";
import UserDeviceToken from "../../userDeviceTokens/model";
import { Op } from "sequelize";
import type { IParams } from "../interfaces";
const model = PushNotification;

const list = async (params: IParams) => {
  try {
    const offset = (params.page - 1) * params.limit;
    const filter: any = {
      offset,
      limit: params.limit,
      order: [["createdAt", "DESC"]],
      where: {},
    };
    const data = await model.findAndCountAll(filter);
    if (!data) {
      throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
    }
    return {
      items: data.rows,
      page: params.page,
      limit: params.limit,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / params.limit),
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

const findUserDeviceTokens = async () => {
  const data = await UserDeviceToken.findAll({
    where: {
      deviceToken: { [Op.ne]: null },
    },
    attributes: ["deviceToken"],
  });

  const tokens = data?.map((user: any) => user?.deviceToken).flat();
  return tokens;
};

const create = async (input: any) => {
  try {
    const { error } = await validationSchema.validateAsync(input);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { file }: any = input;
    input.type = "Global";
    if (file) {
      const filePath = await uploadImage({
        fileName: `${Date.now()}.${file?.extension}`,
        filePath: `pushNotifications`,
        base64: file?.base64,
      });
      input.file = filePath;
    }
    const data = await model.create(input);
    const tokens: any = await findUserDeviceTokens();

    const payload: any = {
      tokens: tokens,
      title: input.title,
      body: input.body,
      additionalData: {
        title: input.title,
        body: input.body,
      },
    };

    if (!!data?.image) {
      payload.additionalData.image = `${data?.file}`;
    }

    await Notification.create({
      title: input.title,
      type: input?.type,
      file: payload?.additionalData?.image || null,
      additionalData: payload?.additionalData,
    });

    if (!!tokens?.length) {
      await NotificationRepository.sendPushNotification(payload);
    }

    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};
const remove = async (id: number) => {
  try {
    const data = await model.findOne({
      where: { id },
    });
    if (!data) {
      throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
    }
    await data?.destroy();
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};
export default {
  create,
  list,
  remove,
};
