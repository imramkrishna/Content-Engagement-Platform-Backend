import { Op } from "sequelize";

const buildListFilter = async (params: any) => {
  const limit = params.limit ? Number(params.limit) : 10;
  const page = params.page ? Number(params.page) : 1;

  const filter: any = {
    where: {},
    limit,
    offset: (page - 1) * limit,
    attributes: [
      "id",
      "productName",
      "productPrice",
      "productDescription",
      "expirationDate",
      "image",
      "status",
      "createdAt",
      "updatedAt",
    ],
    order: [],
  };

  if (params?.status !== undefined && params?.status !== null) {
    const statusValue = params.status;
    if (statusValue === "true" || statusValue === true || statusValue === 1) {
      filter.where.status = true;
    } else if (
      statusValue === "false" ||
      statusValue === false ||
      statusValue === 0
    ) {
      filter.where.status = false;
    }
  }

  if (params?.search) {
    filter.where[Op.or] = [
      { productName: { [Op.iLike]: `%${params.search}%` } },
      { productDescription: { [Op.iLike]: `%${params.search}%` } },
    ];
  }

  if (params?.isExpired !== undefined) {
    const now = new Date();
    if (params.isExpired === "true" || params.isExpired === true) {
      filter.where.expirationDate = { [Op.lt]: now };
    } else {
      filter.where.expirationDate = { [Op.gte]: now };
    }
  }

  if (params?.minPrice !== undefined) {
    filter.where.productPrice = {
      ...filter.where.productPrice,
      [Op.gte]: parseFloat(params.minPrice),
    };
  }

  if (params?.maxPrice !== undefined) {
    filter.where.productPrice = {
      ...filter.where.productPrice,
      [Op.lte]: parseFloat(params.maxPrice),
    };
  }

  if (params?.createdAfter) {
    filter.where.createdAt = {
      ...filter.where.createdAt,
      [Op.gte]: new Date(params.createdAfter),
    };
  }

  if (params?.createdBefore) {
    filter.where.createdAt = {
      ...filter.where.createdAt,
      [Op.lte]: new Date(params.createdBefore),
    };
  }

  const sortBy = params?.sortBy || "createdAt";
  const sortOrder = params?.sortOrder || "DESC";

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "productName",
    "productPrice",
    "expirationDate",
    "status",
  ];
  const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const validSortOrder = ["ASC", "DESC"].includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase()
    : "DESC";

  filter.order = [[validSortBy, validSortOrder]];

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
