import { extractGuestId } from "@/utils/guestId";
import Service from "./service";

const get = async (req: any) => {
  try {
    const { user, cookie, query } = req;
    const filter = {
      ...query,
      ...(user?.id
        ? { createdBy: user.id }
        : { sessionId: extractGuestId(cookie?.guestId?.value) }),
    };

    const data = await Service.list(filter);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const find = async (req: any) => {
  try {
    const { user, cookie } = req;
    const filter = {
      ...(user?.id
        ? { createdBy: user.id }
        : { sessionId: extractGuestId(cookie?.guestId?.value) }),
    };
    const data = await Service.list(filter);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const create = async (req: any) => {
  try {
    const { body, user, cookie } = req;

    if (user?.id) {
      body.createdBy = user.id;
    } else {
      body.sessionId = extractGuestId(cookie?.guestId?.value);
    }

    const data = await Service.create(body);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (req: any) => {
  try {
    const { params, user, cookie } = req;

    const payload = {
      ...(user?.id
        ? { createdBy: user.id }
        : { sessionId: cookie?.guestId?.value }),
    };

    const data = await Service.remove(payload, params?.id);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default {
  get,
  create,
  remove,
  find,
};
