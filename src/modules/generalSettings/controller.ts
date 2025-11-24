import GeneralSettingsService from "./service";

const GeneralSettingsController = {
  create: async (req: Request | any) => {
    try {
      const input = req.body;
      const data = await GeneralSettingsService.create(input);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },

  getByGroup: async (req: Request | any) => {
    try {
      const { group } = req.params;
      const data = await GeneralSettingsService.getByGroup(group);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },

  getByKey: async (req: Request | any) => {
    try {
      const { key } = req.params;
      const data = await GeneralSettingsService.getByKey(key);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },

  update: async (req: Request | any) => {
    try {
      const { id } = req.params;
      const input = req.body;
      const data = await GeneralSettingsService.update(input, id);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },

  delete: async (req: Request | any) => {
    try {
      const { id } = req.params;
      const data = await GeneralSettingsService.remove(id);
      return data;
    } catch (err: any) {
      throw new Error(err);
    }
  },
};

export default GeneralSettingsController;
