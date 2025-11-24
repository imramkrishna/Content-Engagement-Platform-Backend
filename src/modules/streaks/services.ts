import { ERROR_MESSAGES } from "@/utils/messages";
import Streak from "./model";
import { format, differenceInDays } from "date-fns";

export const streakServices = {
  create: async (userId: number) => {
    try {
      return await Streak.create({
        userId,
        streakCount: 2,
        highestStreak: 0,
        streakThisMonth: 0,
        todayScrolls: 0,
        streakAwardedToday: false,
        lastUpdatedDate: new Date(),
        day: 1,
      });
    } catch (error: any) {
      throw new Error(error.message || "Failed to create streak");
    }
  },
  isBreak: (lastUpdatedDate: Date) => {
    const currentDate = new Date();
    const lastStreakDate = new Date(lastUpdatedDate);
    const daysDiff = differenceInDays(currentDate, lastStreakDate);
    const isBreak = daysDiff > 1 ? true : false;
    return isBreak;
  },

  update: async (user: any, input: any) => {
    try {
      const userId = user.id;

      const streak: any = await Streak.findOne({ where: { userId } });

      if (!streak) {
        throw new Error("No streak found for user");
      }
      if (!!input?.todayScrolls && input?.todayScrolls <= 9) {
        const data = await streak.update({
          todayScrolls: input?.todayScrolls,
        });
        return {
          day: data.day,
          highestStreak: data.highestStreak,
          streakThisMonth: data.streakThisMonth,
          streakAwardedToday: false,
          todayScrolls: data.todayScrolls,
        };
      }


      const hasBreak = streakServices.isBreak(streak.lastUpdatedDate);
      const userRegisteredDate = format(user.createdAt, "yyyy-MM-dd");
      const streakUpdatedDate = format(streak.lastUpdatedDate, "yyyy-MM-dd");
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const nowFormatted = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      if (userRegisteredDate == streakUpdatedDate && !hasBreak) {
        if (streak.streakCount == 2) {
          const data = await streak.update({
            streakCount: streak.streakCount + 1,
            streakAwardedToday: true,
            day: currentDate == streakUpdatedDate ? 1 : streak.day + 1,
            streakThisMonth: streak.streakThisMonth + 1,
            lastUpdatedDate:nowFormatted,
            
          });
          return {
            day: data.day,
            currentStreak: data.streakCount,
            highestStreak: data.highestStreak,
            streakThisMonth: data.streakThisMonth,
            streakAwardedToday: data.streakAwardedToday,
            todayScrolls: data.todayScrolls,
          };
        } else {
          return {
            day: streak.day,
            currentStreak: streak.streakCount,
            highestStreak: streak.highestStreak,
            streakThisMonth: streak.streakThisMonth,
            streakAwardedToday: streak.streakAwardedToday,
            todayScrolls: streak.todayScrolls,
          };
        }
      } else {
       
        if (!!hasBreak) {
          const data = await streak.update({
            streakCount:1,
            streakAwardedToday: true,
            day: 1,
            streakThisMonth: streak.streakThisMonth + 1,
            lastUpdatedDate: nowFormatted,
            todayScrolls:10,
          });
          return {
            day: data.day,
            currentStreak: data.streakCount,
            highestStreak: data.highestStreak,
            streakThisMonth: data.streakThisMonth,
            streakAwardedToday: data.streakAwardedToday,
            todayScrolls: data.todayScrolls,
          };
        } else {
          if (currentDate == streakUpdatedDate) {
            return {
              day: streak.day,
              currentStreak: streak.streakCount,
              highestStreak: streak.highestStreak,
              streakThisMonth: streak.streakThisMonth,
              streakAwardedToday: streak.streakAwardedToday,
              todayScrolls: streak.todayScrolls,
            };
          } else {
            const data = await streak.update({
              streakCount: streak.streakCount + 1,
              streakAwardedToday: true,
              day: streak.day + 1,
              streakThisMonth: streak.streakThisMonth + 1,
              lastUpdatedDate: nowFormatted,
              todayScrolls: 10,
            });
            return {
              day: data.day,
              currentStreak: data.streakCount,
              highestStreak: data.highestStreak,
              streakThisMonth: data.streakThisMonth,
              streakAwardedToday: data.streakAwardedToday,
              todayScrolls: data.todayScrolls,
            };
          }
        }
      }
      // const DAY_IN_MS = 24 * 60 * 60 * 1000;
      // const now = new Date();

      // let streak: any = await Streak.findOne({ where: { userId } });

      // if (!streak) {
      //   streak = await Streak.create({
      //     userId,
      //     streakCount: 2,
      //     highestStreak: 0,
      //     streakThisMonth: 0,
      //     todayScrolls: scrollCount,
      //     streakAwardedToday: false,
      //     lastUpdatedDate: now,
      //     day: 1,
      //   });

      //   if (streak.todayScrolls >= 10) {
      //     streak.streakCount = 2;
      //     streak.streakAwardedToday = true;
      //     streak.highestStreak = 2;
      //     streak.streakThisMonth = 1;
      //   }

      //   await streak.save();
      //   return {
      //     day: streak.day,
      //     currentStreak: streak.streakCount,
      //     highestStreak: streak.highestStreak,
      //     streakThisMonth: streak.streakThisMonth,
      //     todayScrolls: streak.todayScrolls,
      //     message: streak.streakAwardedToday
      //       ? "Streak updated successfully"
      //       : "Scrolls updated but streak not yet awarded",
      //   };
      // }

      // const lastUpdate = new Date(streak.lastUpdatedDate);
      // const timeDiff = now.getTime() - lastUpdate.getTime();
      // const daysPassed = Math.floor(timeDiff / DAY_IN_MS);

      // if (daysPassed >= 2) {
      //   // Missed 1+ days -> reset streak
      //   streak.streakCount = 0;
      //   streak.day = 1;
      //   streak.todayScrolls = scrollCount;
      //   streak.streakAwardedToday = false;
      //   streak.lastUpdatedDate = now; // only update on reset
      // } else if (daysPassed === 1) {
      //   // Next day -> increment day
      //   streak.day = (streak.day || 1) + 1;
      //   streak.todayScrolls = scrollCount;
      //   streak.streakAwardedToday = false;
      //   streak.lastUpdatedDate = now; // only update on day change
      // } else {
      //   // Same day -> just add scrolls, do NOT update lastUpdatedDate yet
      //   streak.todayScrolls += scrollCount;
      // }

      // // Award streak if threshold reached and not yet awarded
      // if (!streak.streakAwardedToday && streak.todayScrolls >= 10) {
      //   streak.streakCount += 1;
      //   streak.day = streak.streakCount; // sync day with streakCount
      //   streak.streakAwardedToday = true;
      //   streak.lastUpdatedDate = now; // now we update lastUpdatedDate only when streak is awarded
      //   streak.highestStreak = Math.max(
      //     streak.highestStreak,
      //     streak.streakCount
      //   );
      //   streak.streakThisMonth += 1;
      // }

      // await streak.save();

      // return {
      //   day: streak.day,
      //   currentStreak: streak.streakCount,
      //   highestStreak: streak.highestStreak,
      //   streakThisMonth: streak.streakThisMonth,
      //   todayScrolls: streak.todayScrolls,
      //   message: streak.streakAwardedToday
      //     ? "Streak updated successfully"
      //     : "Scrolls updated but streak not yet awarded",
      // };
    } catch (error: any) {
      throw new Error(error.message || "Failed to update streak");
    }
  },

  list: async (userId: number) => {
    try {
      const streak: any = await Streak.findOne({
        where: { userId },
      });

      if (!streak) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
      const data = streak.dataValues;

      // const DAY_IN_MS = 5 * 1000; // 3 seconds = 1 day
      // const now = new Date();
      // const lastUpdate = new Date(streak.lastUpdatedDate);
      // const timeDiff = now.getTime() - lastUpdate.getTime();
      // const daysPassed = Math.floor(timeDiff / DAY_IN_MS);

      // let day = streak.day || 1;
      // let currentStreak = streak.streakCount;

      // if (daysPassed >= 2) {
      //   // Missed 1+ days -> reset streak
      //   day = 1;
      //   currentStreak = 0;
      // } else if (daysPassed === 1) {
      //   // Next day -> increment day (display only)
      //   day = day + 1;
      //   currentStreak = currentStreak; // streak not yet awarded until scrolls reach threshold
      // }
      // // same day -> no change
      const hasBreak = streakServices.isBreak(data.lastUpdatedDate);
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const streakUpdatedDate = format(streak.lastUpdatedDate, "yyyy-MM-dd");
      console.log(hasBreak,'break')
      return {
        day: hasBreak ? 1 : data.day,
        currentStreak: !!hasBreak ? 0:data.streakCount,
        highestStreak: data.highestStreak,
        streakThisMonth: data.streakThisMonth,
        streakAwardedToday:((currentDate !=streakUpdatedDate) || !!hasBreak) ? false: data.streakAwardedToday,
        todayScrolls:((currentDate !=streakUpdatedDate) || !!hasBreak) ? 0 :    data.todayScrolls,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch streak");
    }
  },
};
