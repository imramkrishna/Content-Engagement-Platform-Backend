import Service from "./service";
const send = async (req: Request) => {
  try {
    const { body } = req;
    const data = await Service.send(body);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};
const resend = async (req: Request) => {
  try {
    const { body } = req;
    const data = await Service.send(body);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

const verify = async (req: Request) => {
  try {
    const { body } = req;
    const data = await Service.verify(body);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};
export default {
  send,
  resend,
  verify,
};
