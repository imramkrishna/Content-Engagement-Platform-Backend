import { extractGuestId } from "@/utils/guestId";
import Service from "./service";

const get = async (req: any) => {
  try {
    const { cookie } = req;
    const filter = { sessionId: extractGuestId(cookie?.guestId?.value) };
    const data = await Service.list(filter);
    return data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch device tokens");
  }
};

const create = async (req: any) => {
  try {
    const { body, cookie } = req;
    body.sessionId = extractGuestId(cookie?.guestId?.value);
    const data = await Service.create(body);
    return data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to create device token");
  }
};

const remove = async (req: any) => {
  try {
    const { body, cookie } = req;
    const sessionId = extractGuestId(cookie?.guestId?.value);
    const data = await Service.removeDeviceToken(
      sessionId as string,
      body?.deviceTokenToRemove
    );
    return data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to remove device token");
  }
};

export default {
  get,
  create,
  remove,
};
