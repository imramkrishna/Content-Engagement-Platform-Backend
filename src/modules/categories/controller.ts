import type { IAuthRequest } from "@/routes";
import Service from "./service";

const get = async (req: Request) => {
  try {
    const { query, headers }: any = req;

    let data;
    if (query?.languageType == "all") {
      data = await Service.list(query);
    } else {
      data = await Service.list(query, headers?.["accept-language"] || "en");
    }

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

export default {
  get,
  create,
  update,
  remove,
};
