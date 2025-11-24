import Service from "./service";
const get = async () => {
  try {
    const data = await Service.get();
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default {
  get,
};
