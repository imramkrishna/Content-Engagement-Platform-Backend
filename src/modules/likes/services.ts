import { likeValidation } from "./validation";
import Like from "./model";
import { Op } from "sequelize";
import { ERROR_MESSAGES } from "@/utils/messages";
import News from "@/modules/news/model";
export const likeServices = {
  create: async (input: any) => {
    try {
      const { error } = await likeValidation.create().validateAsync(input);
      if (error) throw new Error(error.details[0].message);
      const isAlreadyLiked = await Like.findOne({
        where: {
          [Op.and]: [{ senderId: input.senderId }, { newsId: input.newsId }],
        },
      });
      if (isAlreadyLiked) throw new Error("Post is already liked");
      return await Like.create(input);
    } catch (error: any) {
      throw new Error(error);
    }
  },

  remove: async (userId: number, newsId: number) => {
    try {
      console.log(newsId, userId);
      // Find the like
      const like = await Like.findOne({
        where: {
          senderId: userId,
          newsId,
        },
      });

      if (!like) {
        throw new Error("You cannot dislike a news you have not liked");
      }

      // Delete the like
      await like.destroy();

      // Fetch the updated news with likes
      const news: any = await News.findOne({
        where: { id: newsId },
        include: [
          {
            model: Like,
            as: "likes",
            attributes: ["id", "senderId"],
          },
        ],
      });

      if (!news) throw new Error("News not found");

      // Compute isLikedByMe
      const likesArray = news.likes || [];
      const isLikedByMe = likesArray.some((l: any) => l.senderId === userId);

      // Return the news with updated isLikedByMe
      return {
        success: true,
        message: "Like removed successfully",
      };
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
