import Repository from "./repository";
import Model from "./model";
import Validation from "./validationSchema";

const list = async (params: any) => {
  try {
    const filter: any = await Repository.buildListFilter(params);
    const data = await Model.scope("withNews").findAll(filter);
    return data;
  } catch (err: any) {
    throw err;
  }
};

const create = async (input: {
  newsId: number;
  userId?: number;
  sessionId?: string;
}) => {
  const { newsId, userId, sessionId } = input;

  if (!newsId) {
    throw new Error("newsId is required");
  }

  const payload: any = {
    newsId,
  };
  if (!!userId) {
    payload.createdBy = newsId;
  } else if (!!sessionId) {
    payload.sessionId = sessionId;
  }

  const existing = await Model.findOne({
    where: payload,
  });

  if (!existing) {
    return await Model.create(payload);
  } else {
    return existing;
  }
};

const find = async (id: number) => {
  try {
    const filter: any = await Repository.buildFindFilter({ id });
    const data = await Model.findOne(filter);
    if (!data) {
      throw new Error("Data Not Found");
    }
    return data;
  } catch (err: any) {
    throw err;
  }
};

const update = async (input: any, id: number) => {
  try {
    const { error } = await Validation.validationSchema.validateAsync(input);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const filter: any = await Repository.buildFindFilter({
      sessionId: input.sessionId || null,
      createdBy: input.userId || null,
      id,
    });
    const data = await Model.findOne(filter);
    if (!data) {
      throw new Error("Data not found");
    }

    await data.update(input);
    return data;
  } catch (err: any) {
    throw err;
  }
};

const remove = async (params: any, id: number) => {
  try {
    const filter: any = await Repository.buildFindFilter({ ...params, id });
    const data = await Model.findOne(filter);
    if (!data) {
      throw new Error("Data Not found");
    }
    await data.destroy();
    return data;
  } catch (err: any) {
    throw err;
  }
};

export default {
  list,
  create,
  update,
  remove,
  find,
};
