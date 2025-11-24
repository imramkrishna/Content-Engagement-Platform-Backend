import { likeServices } from "./services";

export const likeController = {
  create: async (req: Request) => {
    const { body } = req;
    try {
      const data = await likeServices.create(body);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  remove: async (req: any) => {
    try {
      const { params, user } = req;

      const { newsId } = params;
      console.log(newsId);
      const userId = user.id;
      const data = await likeServices.remove(userId, newsId);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
