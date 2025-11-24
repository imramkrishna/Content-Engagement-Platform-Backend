import Model from "./model";
import Validation from "./validationSchema";
import Repository from "./repository";
import uploadImage from "@/utils/uploadImage";
import Resource from "./resource";
import NotificationService from "../notifications/service";
import ScheduleService from "../schedules/service";
import Helper from "@/utils/helper";
import { QueryTypes } from "sequelize";
import sequelize from "../../config/db";
import Poll from "../polls/model";
import { preferenceServices } from "../preferences/services";
import News from "./model";
import { Op } from "sequelize";
import Ads from "../ads/model";
const list = async (params: any, language?: string) => {
  try {
    const userIdNum = params.userId ? Number(params.userId) : null;
    const preferredCategoryIds = userIdNum
      ? await preferenceServices.getPreferredCategoryIds(userIdNum)
      : [];

    const filter: any = await Repository.buildListFilter(
      params,
      preferredCategoryIds
    );
    // Fetch news with all required scopes
    const data: any = await Model.scope([
      "withCategory",
      "withLike",
      "withCategories",
      "withPoll",
    ]).findAndCountAll(filter);

    // Format/translate news via Resource (computes isLikedByMe internally)
    let response: any = await Resource.collection(
      data.rows,
      language || "en",
      userIdNum
    );

    const categoryIds = [
      ...new Set(
        response
          .map((news: any) => news.categories?.map((cat: any) => cat.id))
          .flat()
      ),
    ];
    const adsData = await Ads.findAll({
      where: {
        category: {
          id: {
            [Op.in]: categoryIds,
          },
        },
        status: "Active",
      },
    });
    let ads: any = {};
    await Promise.all(
      adsData?.map((ad: any) => {
        ads[ad.category.id] = {
          title: ad.title,
          image: ad.image,
          link: ad.link,
          frequency: parseInt(ad.frequency),
          categoryId: ad.category.id,
        };
      })
    );

    // Filter preferred categories if needed
    if (
      params.type === "preferred" &&
      userIdNum &&
      preferredCategoryIds.length > 0
    ) {
      response = response.filter((news: any) => {
        const newsCategoryIds =
          news.categories?.map((cat: any) => cat.id) || [];
        return newsCategoryIds.some((catId: number) =>
          preferredCategoryIds.includes(catId)
        );
      });
    }

    // Add totalViews if ordering by trending
    if (
      (params?.orderByTrending === "true" ||
        params?.orderByTrending === true) &&
      Array.isArray(response)
    ) {
      response = response.map((item: any, index: number) => {
        const src = data.rows[index];
        const srcPlain = src?.get ? src.get({ plain: true }) : src;
        const totalViews = Number(srcPlain?.totalViews || 0);
        return { ...item, totalViews };
      });
    }

    const totalItems = Array.isArray(data.count)
      ? data.count.length
      : data.count || 0;
    const totalPages = Math.ceil(totalItems / (params.limit || 1));
    let categoryCounter = 0;
    response = response?.map((news: any, index: number) => {
      let findAds: any = null;
      const categoriesIds = news?.categories?.map((cat: any) => cat.id);
      categoriesIds.forEach((categoryId: number) => {
        if (!!ads[categoryId]) {
          findAds = ads[categoryId];
        }
      });

      if (!!findAds) {
        categoryCounter++;
        const isAppend = findAds.frequency == categoryCounter;
        if (isAppend) {
          news.ads = findAds;
          delete ads[findAds.categoryId];
        }
      }

      return news;
    });

    return {
      items: response,
      page: params.page,
      limit: params.limit,
      totalItems,
      totalPages,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

const find = async (id: any, language?: string, query: any = {}) => {
  try {
    const userId = query?.userId ? Number(query.userId) : null;

    // Build filter
    const filter: any = await Repository.buildFindFilter({
      id,
      ...(query || {}),
    });

    // Fetch data with required scopes
    const data: any = await Model.scope([
      "withCategory",
      "withCategories",

      "withLike",
      "withPoll",
    ]).findOne(filter);

    if (!data) {
      throw new Error("Data Not Found");
    }

    // Convert to plain object or translate
    let response: any = language
      ? await Resource.toJson(data, language)
      : data.get
      ? data.get({ plain: true })
      : data;

    // Add isLikedByMe
    const likesArray = response.likes || [];
    response.isLikedByMe = userId
      ? likesArray.some((like: any) => Number(like.senderId) === userId)
      : false;

    return response;
  } catch (err: any) {
    throw new Error(err.message || "Something went wrong");
  }
};

const create = async (input: any) => {
  try {
    const { value, error } = Validation.validationSchema.validate(input);

    if (error) {
      throw new Error(error.details[0].message);
    }

    input = value;
    const date = !!input?.infos?.date
      ? Helper.convertNepDateTimeToUtc(input?.infos?.date)
      : null;

    if (input?.image?.base64) {
      input.image = await uploadImage({
        filePath: `news`,
        fileName: `${Date.now()}-news.${input?.image?.extension}`,
        base64: input?.image?.base64,
      });
    }
    if (input.images && input.images.length > 0) {
      input.images = await Promise.all(
        input.images.map((image: any) =>
          uploadImage({
            filePath: "news",
            fileName: `${Date.now()}-news.${image.extension}`,
            base64: image.base64,
          })
        )
      );
      if (input?.images?.length) {
        input.image = input.images[0];
      }
    }

    if (input.status === "Draft") {
      input.isActive = false;
      if (input.infos) {
        input.infos.date = null;
      }
    } else if (!!date && new Date(date).getTime() >= Date.now()) {
      input.isActive = false;
      input.status = "Schedule";
    } else {
      input.status = "Published";
      input.isActive = true;
      input.infos.date = Date.now();
      if (!input.infos) input.infos = {};
    }

    const data: any = await Model.create(input);

    if (input.categoryIds && input.categoryIds.length) {
      await data.setCategories(input.categoryIds);
    }

    if (data?.status == "Schedule") {
      await ScheduleService.create({
        key: `news-${data?.id}`,
        date: date,
        info: {
          id: data?.id,
          categoryId: data?.categoryId,
        },
      });
    }

    if (input.poll) {
      await Poll.create({
        newsId: data.id,
        title: input.poll.title,
        question: input.poll.question,
        answers: input.poll.answers,
      });
    }
    if (data?.status == "Published") {
      // NotificationService.sendToAllUsers({
      //   id: data?.id,
      //   title: data?.title?.en,
      //   body: data?.body?.en,
      //   image: data?.image,
      //   categoryId: data?.categoryId,
      // });
    }

    // Schedule automatic status update when news expires (if newsExpiry is set)
    if (input?.infos?.newsExpiry) {
      try {
        const newsExpiryDate = new Date(input.infos.newsExpiry);
        await ScheduleService.createNewsExpirationJob(data.id, newsExpiryDate);
      } catch (scheduleError) {
        console.warn("Failed to schedule news expiry:", scheduleError);
        // Don't fail the creation if scheduling fails
      }
    }

    return await find(data?.id);
  } catch (err: any) {
    console.log(err);
    throw new Error(err);
  }
};

const update = async (input: any, id: number) => {
  try {
    const { error } = await Validation.updateValidationSchema.validateAsync(
      input
    );
    if (error) throw new Error(error.details[0].message);
    const news: any = await News.findByPk(id);
    if (!news) throw new Error(`News with id ${id} not found`);

    if (input?.image?.base64) {
      input.image = await uploadImage({
        filePath: `news`,
        fileName: `${Date.now()}-news.${input?.image?.extension}`,
        base64: input?.image?.base64,
      });
    }
    if (input.images && input.images.length > 0) {
      input.images = await Promise.all(
        input.images.map((image: any) =>
          uploadImage({
            filePath: "news",
            fileName: `${Date.now()}-news.${image.extension}`,
            base64: image.base64,
          })
        )
      );
      if (input?.images?.length) {
        input.image = input.images[0];
      }
    }

    if (input.categoryIds && input.categoryIds.length) {
      await news.setCategories(input.categoryIds);
    }
    if (input.poll) {
      const existingPoll = await Poll.findOne({ where: { newsId: id } });
      if (existingPoll) {
        await existingPoll.update({
          title: input.poll.title,
          question: input.poll.question,
          answers: input.poll.answers,
        });
      } else {
        await Poll.create({
          newsId: id,
          title: input.poll.title,
          question: input.poll.question,
          answers: input.poll.answers,
        });
      }
    }
    const updatedNews = await news.update(input, { where: id });

    // If newsExpiry was updated, reschedule the expiry job
    if (input?.infos?.newsExpiry) {
      try {
        // Remove old scheduled job if it exists
        await ScheduleService.remove(`news-expire-${id}`);
        // Create new scheduled job with new expiry date
        const newsExpiryDate = new Date(input.infos.newsExpiry);
        await ScheduleService.createNewsExpirationJob(id, newsExpiryDate);
      } catch (scheduleError) {
        console.warn("Failed to reschedule news expiry:", scheduleError);
        // Don't fail the update if scheduling fails
      }
    }

    return updatedNews;
  } catch (error: any) {
    throw new Error(error);
  }
};

const remove = async (id: number) => {
  const data: any = await News.findByPk(id);

  // Remove scheduled jobs (both publishing and expiry)
  try {
    await ScheduleService.remove(`news-${id}`);
    await ScheduleService.remove(`news-expire-${id}`);
  } catch (scheduleError) {
    console.warn("Failed to remove scheduled jobs:", scheduleError);
    // Don't fail the deletion if job removal fails
  }

  await data.destroy();
  return data;
};

const updateStatus = async (input: any, id: number) => {
  try {
    await Validation.updateStatusValidationSchema.validateAsync(input);

    const news: any = await News.findByPk(id);

    const payload: any = {
      status: input.status,
    };

    if (input.status === "Draft") {
      payload.isActive = false;
      payload.infos = {
        ...(news.infos || {}),
        scheduledDate: null,
      };
    } else if (input.status === "Schedule") {
      if (!input.publishDate) {
        throw new Error("Scheduled status requires a publishDate");
      }

      payload.isActive = false;
      payload.infos = {
        ...(news.infos || {}),
        scheduledDate: input.publishDate,
      };
    } else if (input.status === "Published") {
      payload.isActive = true;
      payload.infos = {
        ...(news.infos || {}),
        scheduledDate: null,
      };
      await sequelize.query(
        `UPDATE ${news.constructor.getTableName()} SET createdAt = :createdAt WHERE id = :id`,
        {
          replacements: { createdAt: new Date(), id },
          type: QueryTypes.UPDATE,
        }
      );
    }

    await news.update(payload);
    if (input.status == "Published") {
      NotificationService.sendToAllUsers({
        id: news?.id,
        categoryId: news?.categoryId,
      });
    }
    return news.reload();
  } catch (err: any) {
    return {};
    throw new Error(err);
  }
};

const updateExpiredNewsStatus = async () => {
  try {
    const now = new Date();
    const expiredNews = await Model.findAll({
      where: {
        status: "Published", // Only update published news
        isActive: true,
      },
    });

    const expiredNewsToUpdate = expiredNews.filter((news: any) => {
      const newsExpiry = news?.infos?.newsExpiry;
      return newsExpiry && new Date(newsExpiry) <= now;
    });

    const updatePromises = expiredNewsToUpdate.map(async (news: any) => {
      const updatedInfos = {
        ...news.infos,
        newsExpiry: null, // Clear the expiry date
      };

      await news.update({
        status: "Draft",
        isActive: false,
        infos: updatedInfos,
      });
      return news;
    });

    await Promise.all(updatePromises);

    console.log(
      `Updated ${expiredNewsToUpdate.length} expired news to Draft status`
    );
    return expiredNewsToUpdate;
  } catch (err: any) {
    console.error("Error updating expired news:", err);
    throw new Error(err);
  }
};

export default {
  list,
  find,
  create,
  update,
  remove,
  updateStatus,
  updateExpiredNewsStatus,
};
