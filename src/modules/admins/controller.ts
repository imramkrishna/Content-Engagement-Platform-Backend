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
const create = async (req: Request) => {
  try {
    const { body }: any = req;
    const data = await Service.create(body);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};
const login = async (req: Request) => {
  try {
    const { body, headers }: any = req;
    const data = await Service.login({
      ...body,
      host: headers?.host,
      userAgent: headers["user-agent"],
    });
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const logout = async (req: IAuthRequest) => {
  try {
    const { body, user }: any = req;
    const data = await Service.logout(body, user?.id);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const find = async (req: IAuthRequest) => {
  try {
    const { user } = req;
    const data = await Service.find(user?.id);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const changePassword = async (req: IAuthRequest) => {
  try {
    const { user, body } = req;
    const data = await Service.changePassword(body, user?.id);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const update = async (req: IAuthRequest) => {
  try {
    const { params, body } = req;
    const data = await Service.update(body, params?.id);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default {
  get,
  create,
  login,
  logout,
  find,
  changePassword,
  update,
};
