import env from "../config/env";
const checkApiKey = async (request: any) => {
  // Skip API key check for OPTIONS requests (CORS preflight)
  if (request.method === "OPTIONS") {
    return true;
  }

  const apiKey = request.headers.get("Api-Key");
  if (apiKey !== env.API_KEY && !request.url.includes("/api/health")) {
    throw new Error("Invalid Api Key");
  } else {
    return true;
  }
};

export default checkApiKey;
