import type { IAuthRequest } from "@/routes";
import Service from "./service";

const get = async (req: Request) => {
  try {
    const { query }: any = req;
    const data = await Service.list(query);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const getById = async (req: IAuthRequest) => {
  try {
    const { params }: any = req;
    const data = await Service.find(Number(params?.id));
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const create = async (req: IAuthRequest) => {
  try {
    const { body } = req;
    const data = await Service.create(body);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const update = async (req: IAuthRequest) => {
  try {
    const { body, params } = req;
    const data = await Service.update(body, Number(params?.id));
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (req: IAuthRequest) => {
  try {
    const { params } = req;
    const data = await Service.remove(Number(params?.id));
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const updateExpiredStatus = async (req: IAuthRequest) => {
  try {
    const data = await Service.updateExpiredStatus();
    return {
      message: "Expired rewards updated successfully",
      updatedCount: data.length,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default {
  get,
  getById,
  create,
  update,
  remove,
  updateExpiredStatus,
};
