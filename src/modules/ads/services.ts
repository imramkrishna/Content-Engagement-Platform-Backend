import { ERROR_MESSAGES } from "@/utils/messages";
import helper from "@/utils/helper";
import Ads from "./model";
import { adsValidation } from "./validation";
import uploadImage from "@/utils/uploadImage";

export const adsServices = {
  create: async (input: any) => {
    try {
      const { error } = await adsValidation.create().validateAsync(input);
      if (error) throw new Error(error.details[0].message);
      if (input?.image?.base64) {
        input.image = await uploadImage({
          filePath: `news`,
          fileName: `${Date.now()}-news.${input?.image?.extension}`,
          base64: input?.image?.base64,
        });
      }
      return await Ads.create(input);
    } catch (error: any) {
      throw new Error(error);
    }
  },
  update: async (adsId: number, input: any) => {
    try {
      const ad = await Ads.findByPk(adsId);
      if (!ad) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
      const { error } = await adsValidation.update().validateAsync(input);
      if (error) throw new Error(error.details[0].message);
      if (input?.image?.base64) {
        input.image = await uploadImage({
          filePath: `news`,
          fileName: `${Date.now()}-news.${input?.image?.extension}`,
          base64: input?.image?.base64,
        });
      }
      return await ad.update(input);
    } catch (error: any) {
      throw new Error(error);
    }
  },
  updateStatus: async (adsId: number, input: any) => {
    try {
      const ad = await Ads.findByPk(adsId);
      if (!ad) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
      const { error } = await adsValidation.updateStatus().validateAsync(input);
      if (error) throw new Error(error.details[0].message);
      await ad.update({ status: input.status });
      return ad;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  remove: async (adsId: number) => {
    try {
      const ad = await Ads.findByPk(adsId);
      if (!ad) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
      await ad.destroy();
    } catch (error: any) {
      throw new Error(error);
    }
  },
  list: async (query: any) => {
    try {
      const where: any = {};
      if (query.category) where.category = query.category;
      if (query.status) where.status = query.status;

      const totalItems = await Ads.count({ where });

      const pagination = helper.paginate(query, totalItems);

      const items = await Ads.findAll({
        where,
        offset: pagination.offset,
        limit: pagination.limit,
        order: [["createdAt", "DESC"]],
      });

      return {
        items: items || [],
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages,
        page: pagination.currentPage,
      };
    } catch (error: any) {
      throw new Error(error);
    }
  },
  find: async (id: any) => {
    try {
      const data = await Ads.findByPk(id);
      if (!data) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
