import uploadImage from "@/utils/uploadImage";
import Model from "./model";
import Validation from "./validationSchema";
import Repository from "./repository";
import removeFile from "@/utils/removeFile";
import Resource from "./resource";
const list = async (params: any, language?: any) => {
  try {
    const filter = await Repository.buildListFilter(params);
    const data = await Model.findAll(filter);
    let response;

    if (language) {
      response = await Resource.collection(data, language);
    } else {
      response = data;
    }

    return response;
  } catch (err: any) {
    throw new Error(err);
  }
};

const create = async (input: any) => {
  try {
    const { error } = await Validation.validationSchema.validateAsync(input);
    if (error) throw new Error(error.details[0].message);
    const existing = await Model.findOne({ where: { name: input.name } });
    if (existing) throw new Error("Category name already exists");

    if (input?.image?.base64) {
      input.image = await uploadImage({
        filePath: `categories`,
        fileName: `${Date.now()}-category.${input?.image?.extension}`,
        base64: input?.image?.base64,
      });
    }

    const data: any = await Model.create(input);
    return await find(data.id);
  } catch (err: any) {
    throw new Error(err);
  }
};

const find = async (id: number) => {
  const filter = await Repository.buildFindFilter({ id });
  const data = await Model.findOne(filter);
  if (!data) throw new Error("Data Not Found");
  return data;
};

const update = async (input: any, id: any) => {
  try {
    console.log(input, id);
    const { error } = await Validation.validationSchema.validateAsync(input);
    if (error) throw new Error(error.details[0].message);

    const data: any = await find(id);

    if (input.name) {
      const duplicate: any = await Model.findOne({
        where: { name: input.name },
      });
      if (duplicate && duplicate.id !== id) {
        throw new Error("Another category with this name already exists");
      }
    }

    if (input?.image?.base64) {
      if (data?.image) {
        await removeFile({ filePath: data.image });
      }

      input.image = await uploadImage({
        filePath: `categories`,
        fileName: `${Date.now()}-category.${input?.image?.extension}`,
        base64: input?.image?.base64,
      });
    }

    await data.update(input);
    return await find(data.id);
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (id: number) => {
  try {
    const data: any = await find(id);

    const newsCount = await data.countNews();
    if (newsCount > 0) {
      throw new Error("Cannot delete category with news articles");
    }

    if (data?.image) {
      await removeFile({ filePath: data.image });
    }

    await data.destroy();
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default {
  list,
  create,
  find,
  update,
  remove,
};
