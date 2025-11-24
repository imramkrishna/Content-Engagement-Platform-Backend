import { ERROR_MESSAGES } from "@/utils/messages";
import News from "../news/model";
import Comment from "./model";
import { commentValidation } from "./validation";

export const commentServices = {
  create: async (input: any) => {
    try {
      const { error } = await commentValidation.create().validateAsync(input);
      if (error) throw new Error(error.details[0].message);
      return await Comment.create(input);
    } catch (error: any) {
      throw new Error(error);
    }
  },
  update: async (input: any, commentId: number) => {
    try {
      const comment = await Comment.findByPk(commentId);
      if (!comment) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
      const { error } = await commentValidation.update().validateAsync(input);
      if (error) throw new Error(error.details[0].message);
      return comment.update(input, { where: { id: commentId } });
    } catch (error: any) {
      throw new Error(error);
    }
  },
  remove: async (commentId: number) => {
    try {
      const comment = await Comment.findByPk(commentId);
      if (!comment) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
      await comment.destroy();
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
