import { ERROR_MESSAGES } from "@/utils/messages";
import Feedback from "./model";
import { feedbackValidation } from "./validation";
import helper from "@/utils/helper";

export const feedbackServices = {
  create: async (input: any) => {
    try {
      const { error } = await feedbackValidation.create().validateAsync(input);
      if (error) throw new Error(error.details[0].message);
      return await Feedback.create(input);
    } catch (error: any) {
      throw new Error(error);
    }
  },
  listAll: async (query: any) => {
    try {
      const totalItems = await Feedback.count();

      const pagination = helper.paginate(query, totalItems);

      const data = await Feedback.scope("withUser").findAll({
        offset: pagination.offset,
        limit: pagination.limit,
        order: [["createdAt", "DESC"]],
      });

      return {
        items: data || [], // return empty array instead of throwing error
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages,
        page: pagination.currentPage,
      };
    } catch (error: any) {
      // throw new Error(error);
    }
  },
  listByUser: async (userId: number) => {
    try {
      const { error } = await feedbackValidation
        .listByUser()
        .validateAsync({ userId });
      if (error) throw new Error(error.details[0].message);
      return await Feedback.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
    } catch (error: any) {
      throw new Error(error);
    }
  },

  remove: async (id: number) => {
    try {
      const feedback = await Feedback.findByPk(id);
      if (!feedback) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
      await feedback.destroy();
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
