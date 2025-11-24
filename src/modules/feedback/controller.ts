import { feedbackServices } from "./services";

export const feedbackController = {
  create: async (req: Request) => {
    const { body } = req as any;
    try {
      const data = await feedbackServices.create(body);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  listAll: async (req: any) => {
    try {
      const data = await feedbackServices.listAll(req.query || {});
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  listByUser: async (req: any) => {
    const { params } = req;
    try {
      const data = await feedbackServices.listByUser(Number(params.userId));
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  remove: async (req: any) => {
    try {
      const { params } = req;
      const data = await feedbackServices.remove(Number(params.id));
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
