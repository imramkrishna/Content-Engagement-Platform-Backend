import Poll from "@/modules/polls/model.ts";
import helper from "@/utils/helper";
import { ERROR_MESSAGES } from "@/utils/messages.ts";
import { createAnswerValidation, updateStatusValidation } from "./validation";
import PollResource from "./resource";
import News from "../news/model";

export const pollServices = {
  list: async (query: any, language: string = "en", userId?: number) => {
    try {
      const status = query.status || "Active";
      const totalItems = await Poll.count({ where: { status } });
      const pagination = helper.paginate(query, totalItems);

      const polls = await Poll.findAll({
        where: { status },
        offset: pagination.offset,
        limit: pagination.limit,
      });

      const items = await Promise.all(
        polls.map(async (poll: any) => {
          let newsData: any = null;
          if (poll.newsId) {
            const news: any = await News.findByPk(poll.newsId, {
              include: ["categories"],
            });

            if (news) {
              // Format the poll for this news
              const answerStats: Record<string, number> = {};
              const totalResponses = (poll.answerBy || []).length;

              poll.answers.forEach((option: any, index: number) => {
                const key = `option_${index + 1}`;
                answerStats[key] = (poll.answerBy || []).filter(
                  (ans: any) => ans.answerIndex === index + 1
                ).length;
              });

              const userAnswer = (poll.answerBy || []).find(
                (ans: any) => ans.userId === userId
              );

              const formattedPoll = {
                id: poll.id,
                title: language
                  ? poll.title[language] || poll.title.en
                  : poll.title,
                question: language
                  ? poll.question[language] || poll.question.en
                  : poll.question,
                answers: (poll.answers || []).map(
                  (answer: any, index: number) => ({
                    id: index + 1,
                    answer: language ? answer[language] || answer.en : answer,
                    count: answerStats[`option_${index + 1}`] || 0,
                  })
                ),
                answerStats,
                totalResponses,
                isAnsweredByMe: !!userAnswer,
                myAnswerIndex: userAnswer?.answerIndex || null,
              };

              newsData = {
                id: news.id,
                title: news.title[language],
                status: news.status,
                content: news.content[language],
                image: news.image,
                images: news.images,
                categories: news.categories.map((category: any) => ({
                  id: category?.id || null,
                  name: category?.name?.[language] || "",
                })),
                infos: {
                  scheduleDate: news?.infos?.scheduleDate || "",
                  newsSource: news?.infos?.newsSource?.[language] || "",
                  newsSourceLink: news?.infos?.newsSourceLink || "",
                  newsExpiry: news?.infos?.newsExpiry || "",
                  imageSource: news?.infos?.imageSource?.[language] || "",
                  author: news?.infos?.author?.[language] || "",
                  date: news?.infos?.date || "",
                },
                slug: news.slug,
                createdAt: news.createdAt,
                isActive: news.isActive,
                isTrending: news.isTrending,
                poll: formattedPoll,
                likesCount: news.likesCount || 0,
                isLikedByMe: news.isLikedByMe || false,
              };
            }
          }

          return (
            newsData || { poll: await PollResource.toJson(poll, language) }
          );
        })
      );

      return {
        items: items || [],
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages,
        page: pagination.currentPage,
      };
    } catch (error: any) {
      console.error("Error fetching polls:", error);
      return {
        items: [],
        totalItems: 0,
        totalPages: 0,
        page: query.page || 1,
      };
    }
  },

  // createAnswer: async (input: any, params: any) => {
  //   try {
  //     const poll: any = await Poll.findByPk(params.id);
  //     if (!poll) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);

  //     const { error } = await createAnswerValidation.validateAsync(input);
  //     if (error) throw new Error(error.details[0].message);

  //     const existingAnswers = poll.answerBy || [];

  //     const alreadyAnswered = existingAnswers.some(
  //       (ans: any) => ans.userId === input.answerBy[0].userId
  //     );

  //     if (alreadyAnswered) {
  //       throw new Error("Already answered");
  //     }

  //     const updatedAnswers = [
  //       ...existingAnswers,
  //       {
  //         userId: input.answerBy[0].userId,
  //         answerIndex: input.answerBy[0].answerIndex,
  //       },
  //     ];

  //     await poll.update({ answerBy: updatedAnswers });

  //     // Calculate answerStats
  //     const answerStats: any = {};
  //     const totalResponses = updatedAnswers.length;

  //     // assuming poll.answers contains all possible options with ids 1..n
  //     poll.answers.forEach((option: any, index: number) => {
  //       const optionKey = `option_${index + 1}`;
  //       answerStats[optionKey] = updatedAnswers.filter(
  //         (ans: any) => ans.answerIndex === index + 1
  //       ).length;
  //     });

  //     // Check if current user answered
  //     const userAnswer = updatedAnswers.find(
  //       (ans: any) => ans.userId === input.answerBy[0].userId
  //     );

  //     return {
  //       ...poll.toJSON(),
  //       answerBy: updatedAnswers,
  //       answerStats,
  //       totalResponses,
  //       isAnsweredByMe: !!userAnswer,
  //       myAnswerIndex: userAnswer?.answerIndex || null,
  //     };
  //   } catch (error: any) {
  //     throw new Error(error.message || error);
  //   }
  // },

  createAnswer: async (input: any, params: any, language: string = "en") => {
    try {
      const poll: any = await Poll.findByPk(params.id);
      if (!poll) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);

      const { error } = await createAnswerValidation.validateAsync(input);
      if (error) throw new Error(error.details[0].message);

      const existingAnswers = poll.answerBy || [];

      const { userId, answerIndex } = input.answerBy[0] || {};

      if (userId == null || answerIndex == null)
        throw new Error("Missing userId or answerIndex in input");

      // Check if user already answered
      const alreadyAnswered = existingAnswers.some(
        (ans: any) => ans.userId === userId
      );
      if (alreadyAnswered) throw new Error("Already answered");

      // Validate index within range
      if (
        !Array.isArray(poll.answers) ||
        answerIndex < 0 ||
        answerIndex >= poll.answers.length
      ) {
        throw new Error("Invalid answer index");
      }

      // Append new answer
      const updatedAnswers = [...existingAnswers, { userId, answerIndex }];

      await poll.update({ answerBy: updatedAnswers });

      // Compute stats
      const answerStats: Record<string, number> = {};
      const totalResponses = updatedAnswers.length;

      poll.answers.forEach((option: any, index: number) => {
        const key = `option_${index}`;
        answerStats[key] = updatedAnswers.filter(
          (ans: any) => ans.answerIndex === index
        ).length;
      });

      // Current user answer
      const userAnswer = updatedAnswers.find(
        (ans: any) => ans.userId === userId
      );

      // Format poll
      const formattedPoll = {
        id: poll.id,
        title: poll.title?.[language] || poll.title?.en || "",
        question: poll.question?.[language] || poll.question?.en || "",
        answers: (poll.answers || []).map((answer: any, index: number) => ({
          id: index,
          answer: answer?.[language] || answer?.en || answer,
          count: answerStats[`option_${index}`] || 0,
        })),
        totalResponses,
        isAnsweredByMe: !!userAnswer,
        myAnswerIndex: userAnswer?.answerIndex ?? null,
      };

      // Optional: include linked news
      let newsData: any = null;
      if (poll.newsId) {
        const news: any = await News.findByPk(poll.newsId, {
          include: ["categories"],
        });

        if (news) {
          newsData = {
            id: news.id,
            title: news.title[language],
            status: news.status,
            content: news.content[language],
            image: news.image,
            images: news.images,
            categories: news.categories.map((category: any) => ({
              id: category?.id || null,
              name: category?.name?.[language] || "",
            })),
            infos: {
              scheduleDate: news?.infos?.scheduleDate || "",
              newsSource: news?.infos?.newsSource?.[language] || "",
              newsSourceLink: news?.infos?.newsSourceLink || "",
              newsExpiry: news?.infos?.newsExpiry || "",
              imageSource: news?.infos?.imageSource?.[language] || "",
              author: news?.infos?.author?.[language] || "",
              date: news?.infos?.date || "",
            },
            slug: news.slug,
            createdAt: news.createdAt,
            isActive: news.isActive,
            isTrending: news.isTrending,
            poll: formattedPoll,
            likesCount: news.likesCount || 0,
            isLikedByMe: news.isLikedByMe || false,
          };
        }
      }

      return newsData || { poll: formattedPoll };
    } catch (error: any) {
      throw new Error(error.message || error);
    }
  },

  getPollResults: async (params: any, query?: any, language?: string) => {
    const poll: any = await Poll.findByPk(params.id);
    if (!poll) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);

    const userId = query?.userId;

    const datatosend: any = {
      pollId: poll.id,
      question: language
        ? poll.question[language] || poll.question["en"]
        : poll.question,
      options: language
        ? poll.answers.map((opt: any) => opt[language] || opt["en"])
        : poll.answers,
    };

    if (userId) {
      // Find the user's answer
      const userAnswer = (poll.answerBy || []).find(
        (ans: any) => ans.userId == Number(userId)
      );

      datatosend.userSelected = userAnswer
        ? {
            index: userAnswer.answerIndex,
            option: language
              ? poll.answers[userAnswer.answerIndex][language] ||
                poll.answers[userAnswer.answerIndex]["en"]
              : poll.answers[userAnswer.answerIndex],
          }
        : null;
    } else {
      // Aggregate results for all users
      const answers = poll.answerBy || [];
      const counts: Record<number, number> = {};

      answers.forEach((ans: any) => {
        counts[ans.answerIndex] = (counts[ans.answerIndex] || 0) + 1;
      });

      datatosend.results = poll.answers.map((option: any, index: number) => ({
        answer: language ? option[language] || option["en"] : option,
        count: counts[index] || 0,
      }));
    }

    return datatosend;
  },
  updateStatus: async (params: any, input: any) => {
    try {
      console.log(params.id, "dfs");

      const { error } = await updateStatusValidation.validateAsync(input);
      if (error) throw new Error(error.details[0].message);
      const poll: any = await Poll.findByPk(params.id);
      if (!poll) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
      await poll.update({ status: input.status });
      return {
        pollId: poll.id,
        status: poll.status,
        message: `Poll status updated to ${poll.status}`,
      };
    } catch (error: any) {
      throw new Error(error.message || error);
    }
  },
};
