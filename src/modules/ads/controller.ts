import { adsServices } from "./services";

export const adsController = {
  create: async (req: any) => {
    const { body } = req;
    try {
      const data = await adsServices.create(body);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  update: async (req: any) => {
    const { params, body } = req;
    try {
      const data = await adsServices.update(Number(params.id), body);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  updateStatus: async (req: any) => {
    const { params, body } = req;
    try {
      const data = await adsServices.updateStatus(Number(params.id), body);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  remove: async (req: any) => {
    const { params } = req;
    try {
      const data = await adsServices.remove(Number(params.id));
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  list: async (req: any) => {
    const { query } = req;
    try {
      const data = await adsServices.list(query);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  find: async (req: any) => {
    const { params } = req;
    try {
      const data = await adsServices.find(Number(params.id));
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
