import { Op } from "sequelize";

const buildListFilter = async (params: any) => {
  const filter: any = {
    where: {},
    attributes: ["id", "name", "image", "slug", "isActive", "createdAt"],
    order: [["createdAt", "desc"]],
  };

  if (!!params?.isActive) {
    filter.where = {
      ...filter?.where,
      isActive: params?.isActive == "true" ? true : false,
    };
  }
  if (params?.search) {
    filter.where.name = {
      [Op.like]: `%${params.search}%`,
    };
  }
  return filter;
};

const buildFindFilter = async (params: any) => {
  const where: any = {};
  if (params.id) where.id = params.id;

  return { where };
};

export default {
  buildListFilter,
  buildFindFilter,
};
