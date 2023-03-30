import { AvailableResolutions, TCreateVideoInputModel } from "dto/data.types";
import { app } from "./settings";

require("dotenv").config();
const port = process.env.PORT || 5000;

// const something: TCreateVideoInputModel = {
//   author: "Tania",
//   title: "Pretty analytical girl",
//   availableResolutions: [],
// };

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
