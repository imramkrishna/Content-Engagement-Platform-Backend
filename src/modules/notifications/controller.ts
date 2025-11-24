import { extractGuestId } from "../../utils/guestId";
import PushNotificationService from "./service";
const service = PushNotificationService;
const PushNotificationController = {
  get: async (req: Request | any) => {
    try {
      const { query, cookie, user } = req;
      const data = await service.list({
        page: Number(query?.page) || 1,
        limit: Number(query?.limit) || 10,
        type: query?.type || null,
        sessionId: extractGuestId(cookie?.guestId?.value) || null,
        isRead: query?.isRead || null,
        user,
      });
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  getTotalUnRead: async (req: Request | any) => {
    try {
      const { cookie } = req;
      const data = await service.getTotalUnRead({
        sessionId: extractGuestId(cookie?.guestId?.value) || null,
      });
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },

  update: async (req: Request | any) => {
    try {
      const { id } = req?.params;
      const data = await service.update(req?.user?.id, id);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  markAllRead: async (req: Request | any) => {
    try {
      const data = await service.markAllRead(req?.user?.id);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
  test: async (req: Request) => {
    try {
      const data = await service.test(req.body);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
};
export default PushNotificationController;
