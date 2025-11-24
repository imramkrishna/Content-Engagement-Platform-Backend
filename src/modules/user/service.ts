import helper from "@/utils/helper";
import Model from "./model";
import Validation from "./validationSchema";
import Repository from "./repository";
import Resource from "./resource";
import { ERROR_MESSAGES } from "@/utils/messages";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import Token from "@/utils/token";
import { streakServices } from "../streaks/services";
import uploadImage from "@/utils/uploadImage";
import Category from "../categories/model";
import Preference from "../preferences/model";

const list = async (params: any) => {
  try {
    const filter = await Repository.buildListFilter(params);
    const totalItems = await Model.count({ where: filter.where });
    const pagination = helper.paginate(params, totalItems);

    const users = await Model.scope("withStreak").findAll({
      ...filter,
      offset: pagination.offset,
      limit: pagination.limit,
      include: [
        {
          model: Preference,
          as: "preferences",
          include: [{ model: Category, as: "category" }],
        },
      ],
    });

    const response = users.map((user: any) => {
      const userJson = user.toJSON();
      return userJson;
    });

    return {
      items: response,
      totalItems: pagination.totalItems,
      totalPages: pagination.totalPages,
      page: pagination.currentPage,
    };
  } catch (err: any) {
    throw new Error(err?.message || "Failed to fetch users");
  }
};

const create = async (input: any) => {
  try {
    const { error } = await Validation.createValidationSchema.validateAsync(
      input
    );
    if (error) throw new Error(error.details[0].message);
    // const reverseToken = await Token.reverseTemp(input?.token);
    // if (!reverseToken) {
    //   throw new Error("Invalid Token");
    // }
    // const { email } = reverseToken;
    const user = await Model.findOne({ where: { email: input?.email } });
    if (!user) {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      if (input.image?.base64) {
        const imageUrl = await uploadImage({
          fileName: `${Date.now()}.${input.image.extension}`,
          filePath: `user-profile`,
          base64: input.image.base64,
        });
        input.image = imageUrl;
      }
      const newUser: any = await Model.create({
        ...input,
        isActive: true,
        password: hashedPassword,
      });
      const { password, ...userWithoutPassword } = newUser.get({ plain: true });
      await streakServices.create(newUser?.id);
      return userWithoutPassword;
    } else {
      throw new Error("Already Registered with this email");
    }
  } catch (err: any) {
    throw new Error(err);
  }
};

const find = async (params: any) => {
  const filter = await Repository.buildFindFilter(params);
  const data: any = await Model.scope("withStreak").findOne({
    ...filter,
    include: [
      {
        model: Preference,
        as: "preferences",
        include: [{ model: Category, as: "category" }],
      },
    ],
  });

  if (!data) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);

  const dataJson: any = await Resource.toJson(data);

  return dataJson;
};

const update = async (input: any, id: any) => {
  try {
    // Validate input (without unique constraint)
    await Validation.updateValidationSchema.validateAsync(input);

    const data: any = await Model.findByPk(id);
    if (!data) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);

    // Check for duplicate email or phone
    if (input.email || input.phoneNo) {
      const whereCondition: any = {};
      if (input.email) whereCondition.email = input.email;
      if (input.phoneNo) whereCondition.phoneNo = input.phoneNo;

      const duplicate: any = await Model.findOne({ where: whereCondition });
      if (duplicate && duplicate.id !== id) {
        throw new Error(
          "Another user with this email or phone number already exists"
        );
      }
    }

    // Handle image upload
    if (input.image?.base64) {
      const imageUrl = await uploadImage({
        fileName: `${Date.now()}.${input.image.extension}`,
        filePath: `user-profile`,
        base64: input.image.base64,
      });
      input.image = imageUrl;
    }

    // Handle preferences
    if (input.preferences && Array.isArray(input.preferences)) {
      // Remove duplicates
      const uniquePreferences = Array.from(new Set(input.preferences));

      const categories = await Category.findAll({
        where: { id: uniquePreferences },
      });

      if (categories.length !== uniquePreferences.length) {
        throw new Error("Some categories do not exist");
      }

      await data.setCategories(categories);
    }

    return await data.update(input);
  } catch (err: any) {
    throw new Error(err);
  }
};

const remove = async (id: number) => {
  try {
    const data: any = await Model.findByPk(id);
    if (!data) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);
    await data.destroy();
    return await Resource.toJson(data);
  } catch (err: any) {
    throw new Error(err);
  }
};

const login = async (input: any) => {
  try {
    const { error } = await Validation.loginValidationSchema.validateAsync(
      input
    );
    if (error) throw new Error(error.details[0].message);

    const user: any = await Model.findOne({ where: { email: input.email } });
    if (!user) throw new Error("Invalid email or password");

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    if (!user.isActive) throw new Error("Account is not active");

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: "user",
        type: "user",
      },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "100d" }
    );

    if (input?.deviceToken) {
      const deviceTokens = user?.deviceTokens || [];
      if (!deviceTokens.includes(input?.deviceToken)) {
        await user.update({
          deviceTokens: [...deviceTokens, input?.deviceToken],
        });
      }
    }

    return await Resource.toJsonWithToken(user, token);
  } catch (err: any) {
    throw new Error(err);
  }
};

const logout = async (input: any, id: number) => {
  try {
    const data: any = await find(id);
    if (input?.deviceToken) {
      const filterToken: any = data?.deviceTokens?.filter(
        (token: string) => token !== input?.deviceToken
      );
      data.update({
        deviceToken: filterToken || [],
      });
    }
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const changePassword = async (input: any, userId: number) => {
  try {
    const { error } =
      await Validation.changePasswordValidationSchema.validateAsync(input);
    if (error) throw new Error(error.details[0].message);

    const user: any = await Model.findByPk(userId);
    if (!user) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);

    const isCurrentPasswordValid = await bcrypt.compare(
      input.currentPassword,
      user.password
    );
    console.log(isCurrentPasswordValid);
    if (!isCurrentPasswordValid)
      throw new Error("Current password is incorrect");

    const hashedNewPassword = await bcrypt.hash(input.newPassword, 10);
    return await user.update({ password: hashedNewPassword });

    // return { message: "Password changed successfully" };
  } catch (err: any) {
    throw new Error(err);
  }
};
const forgotPassword = async (input: any) => {
  try {
    const { error } =
      await Validation.forgotPasswordValiationSchema.validateAsync(input);
    if (!!error) {
      throw new Error(error?.details[0].message);
    }
    const reverse = await Token.reverseTemp(input?.token);
    console.log(reverse);
    if (!reverse || reverse?.email !== input?.email || !reverse?.verified) {
      throw new Error("Invalid Request");
    }
    const filter = await Repository.buildFindFilter({
      email: input?.email,
    });

    const data = await Model.findOne(filter);

    if (!data) {
      throw new Error("Data Not Found");
    }
    const password = bcrypt.hashSync(input?.newPassword, 10);
    return await data.update({
      password,
    });
  } catch (err: any) {
    throw new Error(err);
  }
};

const deactivate = async (id: number) => {
  try {
    const data: any = await Model.findByPk(id);
    if (!data) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);

    // Check if user is already deactivated
    if (!data.isActive) {
      throw new Error("Account is already deactivated");
    }

    // Deactivate the user account
    await data.update({ isActive: false });

    return {
      message: "Account deactivated successfully",
      user: await Resource.toJson(data),
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

const activate = async (id: number) => {
  try {
    const data: any = await Model.findByPk(id);
    if (!data) throw new Error(ERROR_MESSAGES.DATA_NOT_FOUND);

    // Check if user is already activated
    if (data.isActive) {
      throw new Error("Account is already activated");
    }

    // Activate the user account
    await data.update({ isActive: true });

    return {
      message: "Account activated successfully",
      user: await Resource.toJson(data),
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default {
  list,
  create,
  find,
  update,
  remove,
  login,
  logout,
  changePassword,
  forgotPassword,
  deactivate,
  activate,
};
