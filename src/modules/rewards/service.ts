import uploadImage from "@/utils/uploadImage";
import Model from "./model";
import Validation from "./validationSchema";
import Repository from "./repository";
import removeFile from "@/utils/removeFile";
import Resource from "./resource";
import { Op } from "sequelize";
import ScheduleService from "../schedules/service";

const list = async (params: any) => {
  try {
    const filter = await Repository.buildListFilter(params);
    const data = await Model.findAndCountAll(filter);

    const response = await Resource.collection(data.rows);

    return {
      items: response,
      page: params.page || 1,
      limit: params.limit || 10,
      totalItems: data.count,
      totalPages: Math.ceil(data.count / (params.limit || 10)),
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

const create = async (input: any) => {
  try {
    const { error } = await Validation.validationSchema.validateAsync(input);
    if (error) throw new Error(error.details[0].message);

    // Check if expiration date is in the future
    const expirationDate = new Date(input.expirationDate);
    const now = new Date();
    if (expirationDate <= now) {
      throw new Error("Expiration date must be in the future");
    }

    if (input?.image?.base64) {
      input.image = await uploadImage({
        filePath: `rewards`,
        fileName: `${Date.now()}-reward.${input?.image?.extension}`,
        base64: input?.image?.base64,
      });
    }

    const data: any = await Model.create(input);

    // Schedule automatic status update when reward expires
    try {
      await ScheduleService.createRewardExpirationJob(data.id, expirationDate);
    } catch (scheduleError) {
      console.warn("Failed to schedule reward expiration:", scheduleError);
      // Don't fail the creation if scheduling fails
    }

    return await find(data.id);
  } catch (err: any) {
    throw new Error(err);
  }
};

const find = async (id: number) => {
  const filter = await Repository.buildFindFilter({ id });
  const data = await Model.findOne(filter);
  if (!data) throw new Error("Reward not found");
  return data;
};

const update = async (input: any, id: any) => {
  try {
    const { error } = await Validation.updateValidationSchema.validateAsync(
      input
    );
    if (error) throw new Error(error.details[0].message);

    const data: any = await find(id);

    let expirationDate;
    if (input.expirationDate) {
      expirationDate = new Date(input.expirationDate);
      const now = new Date();
      if (expirationDate <= now) {
        throw new Error("Expiration date must be in the future");
      }
    }

    if (input?.image?.base64) {
      if (data?.image) {
        await removeFile({ filePath: data.image });
      }

      input.image = await uploadImage({
        filePath: `rewards`,
        fileName: `${Date.now()}-reward.${input?.image?.extension}`,
        base64: input?.image?.base64,
      });
    }

    await data.update(input);

    // If expiration date was updated, reschedule the expiration job
    if (input.expirationDate) {
      try {
        // Remove old scheduled job if it exists
        await ScheduleService.remove(`reward-expire-${id}`);
        // Create new scheduled job with new expiration date
        if (expirationDate) {
          await ScheduleService.createRewardExpirationJob(id, expirationDate);
        }
      } catch (scheduleError) {
        console.warn("Failed to reschedule reward expiration:", scheduleError);
        // Don't fail the update if scheduling fails
      }
    }

    return await find(data.id);
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (id: number) => {
  try {
    const data: any = await find(id);

    if (data?.image) {
      await removeFile({ filePath: data.image });
    }

    // Remove scheduled expiration job
    try {
      await ScheduleService.remove(`reward-expire-${id}`);
    } catch (scheduleError) {
      console.warn("Failed to remove scheduled job:", scheduleError);
      // Don't fail the deletion if job removal fails
    }

    await data.destroy();
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const updateExpiredStatus = async () => {
  try {
    const now = new Date();
    const expiredRewards = await Model.findAll({
      where: {
        expirationDate: { [Op.lt]: now },
        status: true, // Only update rewards that are currently active
      },
    });

    const updatePromises = expiredRewards.map(async (reward) => {
      await reward.update({ status: false });
      return reward;
    });

    await Promise.all(updatePromises);

    console.log(
      `Updated ${expiredRewards.length} expired rewards to inactive status`
    );
    return expiredRewards;
  } catch (err: any) {
    console.error("Error updating expired rewards:", err);
    throw new Error(err);
  }
};

export default {
  list,
  create,
  find,
  update,
  remove,
  updateExpiredStatus,
};
