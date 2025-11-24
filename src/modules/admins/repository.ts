import { Op } from "sequelize";
const buildFindFilter = async (params: any) => {
  const filter: any = {
    where: {},
  };
  if (!params?.includePassword) {
    filter.attributes = {
      exclude: ["password"],
    };
  }
  if (!!params?.id) {
    filter.where = { id: params.id };
  }

  if (params?.username) {
    filter.where = {
      [Op.or]: [{ email: params.username }, { username: params.username }],
    };
  }
  return filter;
};

export default {
  buildFindFilter,
};
