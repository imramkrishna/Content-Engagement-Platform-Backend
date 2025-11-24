import db from "../../config/db";
import { generalSettingAttributes } from "./attributes";
import { Op } from "sequelize";

const GeneralSetting: any = db.define(
  "general_settings",
  generalSettingAttributes,
  {
    tableName: "general_settings",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);
const insertHook: any = async (data: any) => {
  const exist = await GeneralSetting.findOne({
    where: {
      [Op.or]: [{ key: data.key }],
    },
  });
  if (!!exist) {
    throw new Error("Already exists");
  }
};

GeneralSetting.beforeCreate(insertHook);
export default GeneralSetting;
