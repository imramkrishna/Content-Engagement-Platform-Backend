import ScheduleService from "./service";
const controller = {
  test: async () => {
    try {
      const data = await ScheduleService.test();
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
};

export default controller;
