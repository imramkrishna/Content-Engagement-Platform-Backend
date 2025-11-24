import { validationSchema } from "./validationSchema";
import Model from "./model";
import uploadImage from "../../utils/uploadImage";
import removeFile from "../../utils/removeFile";
import { ERROR_MESSAGES } from "../../utils/messages";
import uploadFile from "../../utils/uploadFile";

const create = async (input: any) => {
  try {
    const validate = await validationSchema.validateAsync(input);
    if (validate.error) {
      throw new Error(validate.error.details[0].message);
    }
    if (!!input?.file?.base64) {
      if (input?.file?.extension === "pdf") {
        const { file }: any = input;
        const filePath = await uploadFile({
          fileName: `${Date.now()}.${file?.extension}`,
          filePath: `generalSettings`,
          base64: file?.base64,
        });
        input.file = filePath;
      } else {
        const { file }: any = input;
        const filePath = await uploadImage({
          fileName: `${Date.now()}.${file?.extension}`,
          filePath: `generalSettings`,
          base64: file?.base64,
        });
        input.file = filePath;
      }
    }
    return await Model.create(input);
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const find = async (id: number) => {
  try {
    const data = await Model.findOne({ where: { id: id } });
    if (!!data) {
      return data;
    } else {
      throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

const getByKey = async (key: string) => {
  try {
    const data = await Model.findOne({
      where: { key: key },
    });
    if (!!data) {
      return data;
    } else {
      return {};
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

const getByGroup = async (group: string) => {
  try {
    const data = await Model.findAll({
      where: { group: group },
      order: [["createdAt", "desc"]],
    });
    if (!!data?.length) {
      return data;
    } else {
      return [];
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

const update = async (input: any, id: number) => {
  try {
    const validate = await validationSchema.validateAsync(input);
    if (validate.error) {
      throw new Error(validate.error.details[0].message);
    }
    const data = await find(id);
    if (!!input?.file?.base64) {
      const { file }: any = input;
      if (input?.file?.extension === "pdf") {
        const filePath = await uploadFile({
          filePath: `generalSettings`,
          fileName: `${Date.now()}.${file?.extension}`,
          base64: file?.base64,
        });
        input.file = filePath;
      } else {
        const filePath = await uploadImage({
          filePath: `generalSettings`,
          fileName: `${Date.now()}.${file?.extension}`,
          base64: file?.base64,
        });
        input.file = filePath;
      }
      if (!!data?.file) {
        await removeFile({ filePath: data?.file });
      }
    }

    await data.update(input, { where: { id: id } });
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (id: number) => {
  try {
    const data = await find(id);
    if (!!data?.file) {
      await removeFile({ filePath: data?.file });
    }
    await data.destroy();
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const count = async (params: any) => {
  try {
    const data: any = await Model.count({
      type: params?.type,
    });
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default {
  create,
  update,
  getByKey,
  getByGroup,
  remove,
  count,
};
