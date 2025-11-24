import Service from "./service";
import { extractGuestId } from "../../utils/guestId";
const get = async (req: any) => {
  try {
    const { user, cookie, headers } = req;
    const data = await Service.list(
      {
        createdBy: user?.id || null,
        sessionId: !user?.id ? extractGuestId(cookie?.guestId?.value) : null,
      },
      headers?.["accept-language"] || "en"
    );
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const create = async (req: any) => {
  try {
    const { body, user, cookie, headers } = req;
    if (!!user?.id) {
      body.createdBy = user?.id;
    } else {
      body.sessionId = extractGuestId(cookie?.guestId?.value);
    }

    const data = await Service.create(
      body,
      headers?.["accept-language"] || "en"
    );
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const update = async (req: any) => {
  try {
    const { body, user, cookie, params, headers } = req;
    const payload = {
      ...body,
    };
    if (!!user?.id) {
      body.createdBy = user?.id;
    } else {
      body.sessionId = extractGuestId(cookie?.guestId?.value);
    }
    const data = await Service.update(
      payload,
      params?.id,
      headers?.["accept-language"] || "en"
    );
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (req: any) => {
  try {
    const { params, user, cookie, headers } = req;
    const payload: any = {};
    if (!!user?.id) {
      payload.userId = user?.id;
    } else {
      payload.sessionId = extractGuestId(cookie?.guestId?.value);
    }
    const data = Service.remove(
      payload,
      params?.id,
      headers?.["accept-language"] || "en"
    );
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
