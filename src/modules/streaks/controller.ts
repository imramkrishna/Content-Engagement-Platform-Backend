import { streakServices } from "./services";

export const streakController = {
  update: async (req: Request) => {
    try {
      const { user, body }: any = req;
      const data = await streakServices.update(user, body);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  list: async ({ params }: any) => {
    try {
      const { userId } = params;
      const data = await streakServices.list(userId);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
