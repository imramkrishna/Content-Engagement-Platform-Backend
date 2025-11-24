import PushNotificationService from "./service";
const service = PushNotificationService;
const PushNotificationController = {
  get: async (req: Request | any) => {
    try {
      const query = req?.query;
      const data = await service.list({
        page: Number(query?.page) || 1,
        limit: Number(query?.limit) || 10,
      });
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },

  create: async (req: Request | any) => {
    try {
      const data = await service.create({ ...req.body });
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  delete: async (req: Request | any) => {
    try {
      const { id } = req.params;
      const data = await service.remove(id);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
};
export default PushNotificationController;
