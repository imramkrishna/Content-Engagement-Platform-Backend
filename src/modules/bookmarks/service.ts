import Repository from "./repository";
import Model from "./model";
import Validation from "./validationSchema";
import Resource from "./resource";

const list = async (params: any, language: string) => {
  try {
    const filter: any = await Repository.buildListFilter(params);
    const data = await Model.scope("withNews").findAll(filter);
    const response = await Resource.collection(data, language);
    return response;
  } catch (err: any) {
    throw err;
  }
};

const create = async (input: any, language = "en") => {
  const { error } = Validation.validationSchema.validate(input);
  if (error) {
    throw new Error(error.message);
  }
  const exist = await Model.findOne({
    where: {
      newsId: input.newsId,
      sessionId: input.sessionId,
    },
  });
  if (exist) {
    await Model.destroy({
      where: {
        id: exist.id,
      },
    });
    return exist;
  }

  const data = await Model.create({
    newsId: input.newsId,
    sessionId: input.sessionId,
    createdBy: input?.userId ?? null,
  });

  return await find(data?.id, language);
};

const find = async (id: number, language = "en") => {
  try {
    const filter: any = await Repository.buildFindFilter({ id });
    const data = await Model.scope("withNews").findOne(filter);
    if (!data) {
      throw new Error("Data Not Found");
    }
    return Resource.toJson(data, language);
  } catch (err: any) {
    throw err;
  }
};

const update = async (input: any, id: number, language = "en") => {
  try {
    const { error } = await Validation.validationSchema.validateAsync(input);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const filter: any = await Repository.buildFindFilter({
      sessionId: input.sessionId || null,
      createdBy: input.createdBy || null,
      id,
    });
    const data = await Model.scope("withNews").findOne(filter);
    if (!data) {
      throw new Error("Data not found");
    }

    await data.update({});
    return Resource.toJson(data, language);
  } catch (err: any) {
    throw err;
  }
};

const remove = async (params: any, id: number, language = "en") => {
  try {
    const filter: any = await Repository.buildFindFilter({ ...params, id });
    const data = await Model.scope("withNews").findOne(filter);
    if (!data) {
      throw new Error("Data Not found");
    }
    await data.destroy();
    return Resource.toJson(data, language);
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
