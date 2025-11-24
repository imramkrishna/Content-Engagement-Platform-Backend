import ScheduleService from "../modules/schedules/service";

const schedules = async () => {
  const data: any = await ScheduleService.list();
  if (!!data?.length) {
    data.forEach(async (schedule: any) => {
      const item = await ScheduleService.job(schedule?.key, schedule?.date);
      return item;
    });
  }
  await ScheduleService.removeAllExpired();

  // Create daily maintenance job
  await ScheduleService.createDailyJob();
};

export default schedules;
