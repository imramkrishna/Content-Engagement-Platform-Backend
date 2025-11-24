import db from "../config/db";
import { QueryTypes } from "sequelize";
const password = "$2b$10$P85GuASDA6sDqk60pC3j2.rfT2Ir8opiJYXLAMkHrSitjMCas2euO";

const seeders = async () => {
  await db.query(
    "INSERT INTO admins (name,email,password,username,createdAt,updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    {
      replacements: [
        "Admin",
        "admin@gmail.com",
        password,
        "admin",
        new Date(),
        new Date(),
      ],
      type: QueryTypes.INSERT,
    }
  );
};

seeders().catch((err) => {
  console.log("Failed to seed", err);
  process.exit(1);
});
