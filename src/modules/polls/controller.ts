import { pollServices } from "./services";

export const pollController = {
  list: async (req: any) => {
    try {
      const { query, headers } = req;
      let data;
      if (query?.languageType == "all") {
        data = await pollServices.list(query);
      } else {
        data = await pollServices.list(
          query,
          headers?.["accept-language"] || "en"
        );
      }

      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  createAnswer: async (req: any) => {
    try {
      const { params, body, headers } = req;
      const data = await pollServices.createAnswer(
        body,
        params,
        headers?.["accept-language"] || "en"
      );
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  getPollResult: async (req: any) => {
    try {
      const { params, headers, query } = req;
      let data;
      if (query?.languageType == "all") {
        data = await pollServices.getPollResults(params);
      } else {
        data = await pollServices.getPollResults(
          params,
          query,
          headers?.["accept-language"] || "en"
        );
      }
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
  updateStatus: async (req: any) => {
    try {
      const { params, body } = req;
      const data = await pollServices.updateStatus(params, body);
      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  },
};
