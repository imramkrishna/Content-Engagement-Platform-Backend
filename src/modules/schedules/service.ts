import { scheduleJob } from "node-schedule";
import Model from "./model";
import NewsService from "../news/service";
import RewardsService from "../rewards/service";
import { Op } from "sequelize";
import { format, addMinutes } from "date-fns";
import NotificationService from "../notifications/service";
import PushNotificationRepository from "../notifications/repository";
import Streaks from "../streaks/model";
import User from "../user/model";
const list = async () => {
  const data: any = await Model.findAll({
    where: {
      date: { [Op.gte]: new Date() },
    },
    order: [["createdAt", "ASC"]],
  });
  return data;
};

const removeAllExpired = async () => {
  const data: any = await Model.findAll({
    where: {
      date: { [Op.lt]: new Date() },
    },
  });
  await Promise.all(
    data.map(async (item: any) => {
      const type = item?.key?.includes("news");
      const isReward = item?.key?.includes("reward");

      if (!!type) {
        await NewsService.updateStatus(
          {
            status: "Published",
          },
          item?.info?.id
        );
      } else if (isReward) {
        await RewardsService.updateExpiredStatus();
      }
    })
  );

  // Also check for expired rewards and news that aren't in the schedule table
  await RewardsService.updateExpiredStatus();
  await NewsService.updateExpiredNewsStatus();

  await Model.destroy({
    where: {
      date: { [Op.lt]: new Date() },
    },
  });
  return data;
};

const news = async (data: any) => {
  try {
    const news: any = await NewsService.updateStatus(
      {
        status: "Published",
      },
      data?.id
    );

    // NotificationService.sendToAllUsers({
    //   id: news?.id,
    //   title: news?.title?.en,
    //   body: news?.content?.en,
    //   image: news?.image,
    //   categoryId: news?.categoryId,
    // });
    return {};
  } catch (err: any) {
    return {};
  }
};

const remove = async (key: string) => {
  return await Model.destroy({
    where: {
      key: key,
    },
  });
};

const job = async (key: any, date: any) => {
  scheduleJob(key, date, async () => {
    console.log("Job executed", key, date);
    const data: any = await Model.findOne({
      where: {
        key: key,
      },
    });
    const type = data?.key?.includes("news") ? "News" : "";
    const isReward = data?.key?.includes("reward") ? "Reward" : "";
    const isNewsExpiry = data?.key?.includes("news-expire") ? "NewsExpiry" : "";

    if (type == "News" && !isNewsExpiry) {
      await news(data?.info);
      await remove(key);
      return {
        key: key,
        date: date,
      };
    } else if (isReward == "Reward") {
      await RewardsService.updateExpiredStatus();
      await remove(key);
      return {
        key: key,
        date: date,
      };
    } else if (isNewsExpiry == "NewsExpiry") {
      await NewsService.updateExpiredNewsStatus();
      await remove(key);
      return {
        key: key,
        date: date,
      };
    }
  });
  return {
    key: key,
    date: date,
  };
};

const create = async ({ key, date, info }: any) => {
  const data = await Model.findOne({
    where: {
      key: key,
    },
  });
  if (!data) {
    await Model.create({
      key: key,
      date: date,
      info: info,
    });
    await job(key, format(date, "yyyy-MM-dd HH:mm:ss"));
  }
  return {
    key: key,
    date: date,
  };
};

const test = async () => {
  const date = addMinutes(new Date(), 1);
  const formatDate = format(date, "yyyy-MM-dd HH:mm:ss");
  job("test", formatDate);
};

const createRewardExpirationJob = async (
  rewardId: number,
  expirationDate: Date
) => {
  const key = `reward-expire-${rewardId}`;
  const info = { id: rewardId };
  return await create({ key, date: expirationDate, info });
};

const createNewsExpirationJob = async (
  newsId: number,
  expirationDate: Date
) => {
  const key = `news-expire-${newsId}`;
  const info = { id: newsId };
  return await create({ key, date: expirationDate, info });
};

const createDailyJob = async () => {
  const cronExpression = "0 18 * * *";
  const currentDate = new Date();
  scheduleJob("daily-job", cronExpression, async () => {
    const stickUsers = await Streaks.findAll({
      where: {
        lastUpdatedDate: {
          [Op.eq]: currentDate,
        },
      },
      attributes: ["id", "userId"],
    });
    const userIds = stickUsers.map((item: any) => item.userId);
    const users = await User.findAll({
      where: {
        id: {
          [Op.notIn]: userIds,
        },
        deviceTokens: {
          [Op.ne]: null,
        },
      },
      attributes: ["id", "deviceTokens"],
    });
    const tokens = users.map((item: any) => item.deviceTokens).flat();
    await PushNotificationRepository.sendPushNotification({
      tokens: tokens,
      title: "You’re about to lose your Gistfeed streak 👀",
      body: "✨ Read a few stories now to keep it going!",
      additionalData: {
        title: "You’re about to lose your Gistfeed streak 👀",
        body: "✨ Read a few stories now to keep it going!",
      },
    });
  });

  return {
    key: "daily-job",
    cronExpression: cronExpression,
  };
};

export default {
  list,
  create,
  createRewardExpirationJob,
  createNewsExpirationJob,
  createDailyJob,
  test,
  job,
  remove,
  removeAllExpired,
};
