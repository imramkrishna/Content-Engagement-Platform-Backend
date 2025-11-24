const buildListFilter = ({
  cookie,
}: {
  user?: { id?: number };
  cookie?: any;
}) => {
  const sessionId = extractGuestId(cookie?.guestId?.value);
  return { sessionId };
};

const buildFindFilter = ({
  user,
  cookie,
  id,
}: {
  user?: { id?: number };
  cookie?: any;
  id: number | string;
}) => {
  const base = buildListFilter({ user, cookie });
  return { ...base, id };
};

const extractGuestId = (raw?: string) => {
  if (!raw) return undefined;
  return raw.includes("guestId=") ? raw.split("guestId=")[1] : raw;
};

export default {
  buildListFilter,
  buildFindFilter,
};
