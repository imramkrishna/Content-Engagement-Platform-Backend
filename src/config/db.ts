import { Sequelize } from "sequelize";
const { DB_NAME, DB_USER, DB_PASS, DB_HOST } = process.env;
if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST) {
  throw new Error(
    "Missing required environment variables for database connection."
  );
}
const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
  timezone: "+05:45",
});

export default db;
