import { Op } from "sequelize";

const buildListFilter = async (params: any) => {
  const filter: any = {
    where: {},
    attributes: [
      "id",
      "firstName",
      "lastName",
      "phoneNo",
      "email",
      "image",
      "isActive",
      "language",
      "createdAt",
    ],
    order: [["createdAt", "desc"]],
  };

  if (!!params?.isActive) {
    filter.where = {
      ...filter?.where,
      isActive: params?.isActive == "true" ? true : false,
    };
  }
  if (params?.language === "en") {
    filter.where = {
      ...filter?.where,
      language: "en",
    };
  }
  if (params?.language === "np") {
    filter.where = {
      ...filter?.where,
      language: "np",
    };
  }

  if (params?.search) {
    filter.where = {
      ...filter?.where,
      [Op.or]: [
        { firstName: { [Op.like]: `%${params.search}%` } },
        { lastName: { [Op.like]: `%${params.search}%` } },
        { email: { [Op.like]: `%${params.search}%` } },
        { phoneNo: { [Op.like]: `%${params.search}%` } },
      ],
    };
  }

  return filter;
};

const buildFindFilter = async (params: any) => {
  const where: any = {};
  if (params.id) where.id = params.id;
  if (params.email) where.email = params.email;
  if (params.phoneNo) where.phoneNo = params.phoneNo;

  return { where };
};

export default {
  buildListFilter,
  buildFindFilter,
};
