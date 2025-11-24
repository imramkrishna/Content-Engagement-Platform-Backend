import db from "./config/db";
import server from "./config/server";
import env from "./config/env";
import routeInit from "./routes";
import setupAssociations from "./associations";
import schedules from "./config/schedule";

routeInit(server);

db.authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error: any) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  });

server.listen(env.PORT, async () => {
  console.log(`Server is running at ${env.PORT} port`);
  await schedules();
});
setupAssociations();
