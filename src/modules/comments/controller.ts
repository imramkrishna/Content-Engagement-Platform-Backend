import { commentServices } from "./services";

export const commentController = {
  create: async (req: Request) => {
    const { body } = req;
    try {
      const data = await commentServices.create(body);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  update: async (req: any) => {
    const { body, params } = req;
    const commentId = params;
    try {
      const data = await commentServices.update(body, commentId);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  remove: async (req: any) => {
    const { params } = req;
    const commentId = params;
    try {
      const data = await commentServices.remove(commentId);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
