import Model from "./model";

const list = async (filter: any) => {
  return await Model.findAll({
    where: filter,
    order: [["createdAt", "DESC"]],
  });
};

const find = async (filter: any) => {
  return await Model.findOne({ where: filter });
};

const create = async (input: { deviceToken: string; sessionId?: string }) => {
  let existing: any = await Model.findOne({
    where: {
      sessionId: input?.sessionId,
    },
  });
  const deviceTokens = !!input?.deviceToken ? [input.deviceToken] : [];

  if (existing) {
    await existing.update({
      deviceToken: [...(existing.deviceToken || []), ...deviceTokens],
    });

    return existing;
  } else {
    const data = await Model.create({
      deviceToken: !!input.deviceToken ? deviceTokens : [],
      sessionId: input.sessionId,
    });
    return data;
  }
};

const removeDeviceToken = async (
  sessionId: string,
  deviceTokenToRemove: string
) => {
  const user: any = await Model.findOne({
    where: {
      sessionId,
    },
  });
  const deviceTokens = user?.deviceToken;
  if (user?.id) {
    const newDeviceTokens = deviceTokens.filter(
      (token: string) => token !== deviceTokenToRemove
    );
    await user.update({
      deviceToken: newDeviceTokens,
    });
  }
  return user;
};

export default { list, find, create, removeDeviceToken };
