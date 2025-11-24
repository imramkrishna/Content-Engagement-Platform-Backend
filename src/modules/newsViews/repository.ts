const buildListFilter = (params: any) => {
  const filter: any = {
    where: {},
    attributes: ["id", "newsId", "sessionId", "createdBy"],
  };

  if (params?.userId) {
    filter.where.createdBy = params.userId;
  }
  if (params?.sessionId) {
    filter.where.sessionId = params.sessionId;
  }

  return filter;
};

const buildFindFilter = (params: any) => {
  const filter: any = {
    where: {},
    attributes: ["id", "newsId", "sessionId", "createdBy"],
  };

  if (params?.id) {
    filter.where.id = params.id;
  }

  if (params?.userId) {
    filter.where.createdBy = params.userId;
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
