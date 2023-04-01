import { app } from "./settings";

require("dotenv").config();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

console.log(new Date().toISOString())