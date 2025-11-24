import UserDeviceTokens from "@/modules/userDeviceTokens/model";
import News from "@/modules/news/model";
import NewsViews from "@/modules/newsViews/model";
import { Op, fn, col } from "sequelize";

const get = async () => {
  try {
    const totalActiveUser = await UserDeviceTokens.count({});
    const totalPublishedNews = await News.count({
      where: {
        status: "Published",
      },
    });
    const totalScheduleNew = await News.count({
      where: {
        status: "Scheduled",
      },
    });
    const totalDraftNews = await News.count({
      where: {
        status: "Draft",
      },
    });

    const activeUserTrends = await getDailyActiveUsers();
    const publishedNewsTrends = await getPublishedNewsTrends();
    const scheduledNewsTrends = await getScheduledNewsTrends();
    const draftNewsTrends = await getDraftdNewsTrends();

    return {
      totalActiveUser,
      totalPublishedNews,
      totalScheduleNew,
      totalDraftNews,
      activeUserTrends,
      publishedNewsTrends,
      scheduledNewsTrends,
      draftNewsTrends,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

const getDailyActiveUsers = async () => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const totalNewsCount = await News.count({
      where: {
        status: "Published",
      },
    });
    const dailyActiveUsers = await NewsViews.findAll({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("COUNT", fn("DISTINCT", col("createdBy"))), "uniqueUsers"],
        [fn("COUNT", fn("DISTINCT", col("sessionId"))), "uniqueSessions"],
      ],
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "DESC"]],
    });

    const dailyData = dailyActiveUsers.map((item) => {
      const uniqueUsers = parseInt(item.getDataValue("uniqueUsers") || "0");
      const uniqueSessions = parseInt(
        item.getDataValue("uniqueSessions") || "0"
      );
      const totalActive = uniqueUsers + uniqueSessions;

      const percentage =
        totalNewsCount > 0 ? (totalActive / totalNewsCount) * 100 : 0;

      return {
        date: item.getDataValue("date"),
        uniqueUsers,
        uniqueSessions,
        totalActive,
        percentage: Math.round(percentage * 100) / 100,
      };
    });

    const trend = calculateTrend(dailyData);

    return trend;
  } catch (err: any) {
    throw new Error(err);
  }
};

const getPublishedNewsTrends = async () => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailyPublishedNews = await News.findAll({
      where: {
        status: "Published",
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "DESC"]],
    });

    const dailyData = dailyPublishedNews.map((item) => ({
      date: item.getDataValue("date"),
      count: parseInt(item.getDataValue("count") || "0"),
    }));

    const trend = calculateNewsTrend(dailyData);

    return trend;
  } catch (err: any) {
    throw new Error(err);
  }
};

const getScheduledNewsTrends = async () => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailyScheduledNews = await News.findAll({
      where: {
        status: "Scheduled",
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "DESC"]],
    });

    const dailyData = dailyScheduledNews.map((item) => ({
      date: item.getDataValue("date"),
      count: parseInt(item.getDataValue("count") || "0"),
    }));

    const trend = calculateNewsTrend(dailyData);

    return trend;
  } catch (err: any) {
    throw new Error(err);
  }
};

const getDraftdNewsTrends = async () => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailyScheduledNews = await News.findAll({
      where: {
        status: "Draft",
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "DESC"]],
    });

    const dailyData = dailyScheduledNews.map((item) => ({
      date: item.getDataValue("date"),
      count: parseInt(item.getDataValue("count") || "0"),
    }));

    const trend = calculateNewsTrend(dailyData);

    return trend;
  } catch (err: any) {
    throw new Error(err);
  }
};

const calculateTrend = (data: any[]) => {
  if (data.length < 2) {
    return { trend: "stable", percentage: 0 };
  }

  const sortedData = data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const latest = sortedData[sortedData.length - 1].percentage;
  const previous = sortedData[sortedData.length - 2].percentage;

  if (previous === 0) {
    return { trend: "increasing", percentage: latest > 0 ? 100 : 0 };
  }

  const percentage = ((latest - previous) / previous) * 100;
  const trend =
    percentage > 0 ? "increasing" : percentage < 0 ? "decreasing" : "stable";

  return {
    trend,
    percentage: Math.abs(Math.round(percentage * 100) / 100),
  };
};

const calculateNewsTrend = (data: any[]) => {
  if (data.length < 2) {
    return { trend: "stable", percentage: 0 };
  }

  const sortedData = data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const latest = sortedData[sortedData.length - 1].count;
  const previous = sortedData[sortedData.length - 2].count;

  if (previous === 0) {
    return { trend: "increasing", percentage: latest > 0 ? 100 : 0 };
  }

  const percentage = ((latest - previous) / previous) * 100;
  const trend =
    percentage > 0 ? "increasing" : percentage < 0 ? "decreasing" : "stable";

  return {
    trend,
    percentage: Math.abs(Math.round(percentage * 100) / 100),
  };
};

export default {
  get,
};
