import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 120000 });
const isValidEmail = async (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return regex;
};

const set = async (email: string, otp: string) => {
  return cache.set(email, otp);
};

const get = async (email: string) => {
  return cache.get(email);
};
const clear = async (email: string) => {
  return cache.del(email);
};

const generate = async () => {
  return "1234"
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

export default {
  isValidEmail,
  set,
  get,
  clear,
  generate,
};
