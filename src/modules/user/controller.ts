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

const login = async (req: Request) => {
  try {
    const { body }: any = req;
    const data = await Service.login(body);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const logout = async (req: any) => {
  try {
    const { body, user } = req;
    const data = await Service.logout(body, user?.id);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const changePassword = async (req: IAuthRequest) => {
  try {
    const { body, user } = req;
    console.log(user, "user");
    const data = await Service.changePassword(body, user.id);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const find = async ({ params }: any) => {
  try {
    const data = await Service.find(params);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
const forgotPassword = async (req: Request) => {
  try {
    const { body } = req;
    const data = await Service.forgotPassword(body);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const deactivate = async (req: IAuthRequest) => {
  try {
    const { user } = req;
    const data = await Service.deactivate(user.id);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const activate = async (req: IAuthRequest) => {
  try {
    const { user } = req;
    const data = await Service.activate(user.id);
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
  login,
  logout,
  changePassword,
  find,
  forgotPassword,
  deactivate,
  activate,
};
