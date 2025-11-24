import Service from "./service";
import { extractGuestId } from "@/utils/guestId";
const get = async (req: any) => {
  try {
    const { user, cookie } = req;
    const data = await Service.list({
      createdBy: user?.id || null,
      sessionId: !user?.id ? extractGuestId(cookie?.guestId?.value) : null,
    });
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const create = async (req: any) => {
  try {
    const { body, user, cookie } = req;
    if (!!user?.id) {
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

const update = async (req: any) => {
  try {
    const { body, user, cookie, params } = req;

    // Create a new payload object, do not mutate body directly
    const payload = { ...body };

    if (!!user?.id) {
      payload.createdBy = user.id;
    } else {
      payload.sessionId = extractGuestId(cookie?.guestId?.value);
    }

    const data = await Service.update(payload, params?.id);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (req: any) => {
  try {
    const { params, user, cookie } = req;

    const payload: any = {};
    if (!!user?.id) {
      // Use 'createdBy' to keep consistent with model
      payload.createdBy = user.id;
    } else {
      payload.sessionId = extractGuestId(cookie?.guestId?.value);
    }

    const data = await Service.remove(payload, params?.id);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default {
  get,
  create,
  update,
  remove,
};
