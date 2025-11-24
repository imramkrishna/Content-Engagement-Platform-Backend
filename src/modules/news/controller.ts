import type { IAuthRequest } from "@/routes";
import Service from "./service";
import { extractGuestId } from "@/utils/guestId";

const get = async (req: any) => {
  try {
    const { query, headers, cookie } = req;
    const acceptLanguage =
      headers?.["accept-language"] || headers?.["Accept-Language"] || "en";

    let data;
    if (query?.languageType == "all") {
      data = await Service.list({
        ...query,
        page: Number(query?.page || 1),
        limit: Number(query?.limit || 10),
        sessionId: extractGuestId(cookie?.guestId?.value) || null,
      });
    } else {
      data = await Service.list(
        {
          ...query,
          page: Number(query?.page || 1),
          limit: Number(query?.limit || 10),
        },
        String(acceptLanguage).split(",")[0]?.trim() || "en"
      );
    }

    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};
const find = async (req: any) => {
  try {
    const { params, query, headers } = req;
    const acceptLanguage =
      headers?.["accept-language"] || headers?.["Accept-Language"] || "en";
    let data;
    if (query?.languageType == "all") {
      data = await Service.find(params?.id, "", query);
    } else {
      data = await Service.find(
        params?.id,
        String(acceptLanguage).split(",")[0]?.trim() || "en",
        query
      );
    }

    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const create = async (req: IAuthRequest) => {
  try {
    const { body } = req;
    const data = await Service.create(body);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const update = async (req: IAuthRequest) => {
  try {
    const { body, params } = req;
    const data = await Service.update(body, Number(params?.id));
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (req: IAuthRequest) => {
  try {
    const { params } = req;
    const data = await Service.remove(Number(params?.id));
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const updateStatus = async (req: IAuthRequest) => {
  try {
    const { params, body } = req;
    const data = await Service.updateStatus(body, Number(params?.id));
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const updateExpiredStatus = async (req: IAuthRequest) => {
  try {
    const data = await Service.updateExpiredNewsStatus();
    return {
      message: "Expired news updated successfully",
      updatedCount: data.length,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default {
  get,
  create,
  update,
  remove,
  updateStatus,
  updateExpiredStatus,
  find,
};
