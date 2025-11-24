import Repository from "./repository";
import Model from "./model";
import Validation from "./validationSchema";

const list = async (params: any, scope?: any) => {
  try {
    const filter: any = await Repository.buildListFilter(params);
    const data = await Model.scope(scope).findAll(filter);
    return data;
  } catch (err: any) {
    throw err;
  }
};

const create = async (input: any) => {
  const { error } = Validation.validationSchema.validate(input);
  if (error) {
    throw new Error(error.message);
  }
  if (input.userId && !input.createdBy) {
    input.createdBy = input.userId;
  }
  const findData = await Model.findOne({
    where: {
      sessionId: input?.sessionId,
    },
  });

  if (findData) {
    const categoryIds = Array.from(
      new Set([...(findData.categoryIds || []), ...(input?.categoryIds || [])])
    );
    await findData.update({
      categoryIds: categoryIds,
    });
    return findData.reload();
  } else {
    return await Model.create({
      categoryIds: input.categoryIds,
      sessionId: input.sessionId,
      createdBy: input.createdBy ?? null,
    });
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
  remove,
  find,
};
