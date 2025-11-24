import { preferenceServices } from "./services";

export const preferenceController = {
  list: async (req: any) => {
    const { user, headers, query } = req;
    const data = await preferenceServices.list(
      user,
      headers?.["accept-language"] || "en",
      query
    );
    return data;
  },
};
