import AdminService from "../modules/admins/service";
import Token from "../utils/token";
import userService from "../modules/user/service";
const roles = ["admin", "patient", "doctor", "institution", "user"];
const checkSpecificRole = async (user: any, allowTo: string[]) => {
  if (!allowTo.includes(user?.role)) {
    throw new Error("Unauthorized");
  }
  return user;
};
const checkAuthentication = async (request: any, allowTo: string[] = []) => {
  try {
    const token = request.headers["authorization"];

    if (!token && allowTo.includes("public")) {
    } else {
      if (!token) {
        throw new Error("Unauthorized");
      }

      const tokenWithoutBearer = token.startsWith("Bearer")
        ? token.slice(7)
        : token;
      const decoded = await Token.verify(tokenWithoutBearer);
      if (!decoded) {
        throw new Error("UNAUTHORIZED1");
      } else {
        if (!Array.isArray(allowTo) || !allowTo?.length) {
          throw new Error("Unauthorized");
        } else {
          let user: any = null;
          await checkSpecificRole(decoded, allowTo);
          if (decoded?.role == "admin") {
            const userInfo = await AdminService.find(decoded.id);
            user = {
              ...userInfo?.dataValues,
              role: "admin",
            };
          } else if (roles.includes(decoded?.role)) {
            try {
              user = await userService.find({ id: decoded?.id });
            } catch (error) {
              throw new Error("User not found");
            }
          } else {
            throw new Error("Unauthorized");
          }
          request.user = user;
        }
      }
    }
  } catch (err: any) {
    throw new Error(err.message || "Unauthorized");
  }
};

export default checkAuthentication;
