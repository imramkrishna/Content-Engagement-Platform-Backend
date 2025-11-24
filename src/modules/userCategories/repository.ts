import { Op, literal, where } from "sequelize";

const buildListFilter = async (params: any) => {
  const filter: any = {
    where: {},
    attributes: ["id", "categoryIds", "sessionId", "createdBy"],
  };

  if (params?.categoryId) {
    const categoryCondition = where(
      literal(`JSON_CONTAINS(categoryIds, '[${params.categoryId}]')`),
      true
    );

    filter.where = {
      ...filter.where,
      [Op.and]: [categoryCondition],
    };
  }

  return filter;
};

const buildFindFilter = (params: any) => {
  const filter: any = {
    where: {},
    attributes: ["id", "categoryIds", "sessionId", "createdBy"],
  };

  if (params?.categoryId) {
    filter.where.categoryIds = {
      [Op.contains]: [params.categoryId],
    };
  }
  if (params?.createdBy) {
    filter.where.createdBy = params.createdBy;
  }

  if (params?.sessionId) {
    filter.where.sessionId = params.sessionId;
  }

  return filter;
};

export default {
  buildListFilter,
  buildFindFilter,
};
