import Model from "./model";
import Repository from "./repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import env from "@/config/env";
import Validation from "./validationSchema";
const list = async (params: any) => {
  try {
    const data: any = await Model.findAll({
      where: params,
    });
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};
const create = async (input: any) => {
  try {
    const { error } = await Validation.validationSchema.validateAsync(input);
    if (!!error) {
      throw new Error(error?.details[0].message);
    }
    const data: any = await Model.create({
      ...input,
      password: bcrypt.hashSync(input?.password, 10),
    });
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};
const login = async (input: any) => {
  try {
    const { error } = await Validation.loginValidationSchema.validateAsync(
      input
    );
    if (!!error) {
      throw new Error(error?.details[0].message);
    }
    const filter: any = await Repository.buildFindFilter({
      username: input?.username,
      includePassword: true,
    });
    const data: any = await Model.findOne(filter);
    if (!data) {
      throw new Error("Invalid Credential");
    } else {
      const isMatch = await bcrypt.compare(input.password, data.password);
      if (!data?.isActive) {
        throw new Error("User is inactive");
      }
      if (!!isMatch) {
        const secret: string = env.JWT_SECRET || "";
        const token = await jwt.sign(
          {
            id: data.id,
            name: data.name,
            email: data.email,
            role: "admin",
            host: input?.host,
            userAgent: input?.userAgent,
          },
          secret,
          {
            expiresIn: "30d",
          }
        );
        if (!!input?.deviceToken) {
          if (!!data?.deviceToken && Array.isArray(data?.deviceToken)) {
            const findToken = data?.deviceToken.find(
              (token: string) => input?.deviceToken == token
            );
            if (!findToken) {
              await data.update({
                deviceToken: [...data?.deviceToken, input?.deviceToken],
              });
            }
          } else {
            await data.update({
              deviceToken: [input?.deviceToken],
            });
          }
        }
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          username: data.username,
          isActive: data.isActive,
          role: "admin",
          token,
          deviceToken: data.deviceToken,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          deletedAt: data.deletedAt,
        };
      }
    }
  } catch (err: any) {
    throw new Error(err);
  }
};
const logout = async (input: any, id: number) => {
  try {
    const data: any = await find(id);
    if (input?.deviceToken) {
      const filterToken: any = data?.deviceToken?.filter(
        (token: string) => token !== input?.deviceToken
      );
      data.update({
        deviceToken: filterToken || [],
      });
    }
    return await find(id);
  } catch (err: any) {
    throw new Error(err);
  }
};
const find = async (id: number) => {
  try {
    const filter: any = await Repository.buildFindFilter({
      id: id,
    });
    const data = await Model.findOne(filter);
    if (!!data) {
      data.setDataValue("role", "admin");
      return data;
    } else {
      throw new Error("Data Not Found");
    }
  } catch (err: any) {
    throw new Error(err);
  }
};
const changePassword = async (input: any, id: number) => {
  try {
    const { error } = await Validation.passwordValidationSchema.validateAsync(
      input
    );
    if (!!error) {
      throw new Error(error?.details[0].message);
    }
    const data: any = await Model.findByPk(id);
    if (!data) {
      throw new Error("Data Not Found");
    }
    const isMatch = await bcrypt.compare(
      input?.currentPassword,
      data?.password
    );

    if (!isMatch) {
      throw new Error("Invalid Credential");
    }
    await data.update({ password: bcrypt.hashSync(input?.password, 10) });
    await data.setDataValue("role", "admin");
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const update = async (input: any, id: number) => {
  try {
    const data: any = await Model.findByPk(id);
    const { error } = await Validation.updateValidationSchema.validateAsync(
      input
    );
    if (!!error) {
      throw new Error(error?.details[0].message);
    }
    await data.update(input);
    return data.reload();
  } catch (err: any) {
    throw new Error(err);
  }
};
export default {
  list,
  create,
  login,
  logout,
  find,
  changePassword,
  update,
};
