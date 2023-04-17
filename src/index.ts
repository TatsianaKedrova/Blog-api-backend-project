import { runDB } from "./repositories/db";
import { app } from "./settings";

require("dotenv").config();
const port = process.env.PORT || 5000;

const startApp = async () => {
  await runDB();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();
