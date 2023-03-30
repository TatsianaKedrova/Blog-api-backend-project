"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
require("dotenv").config();
const port = process.env.PORT || 5000;
// const something: TCreateVideoInputModel = {
//   author: "Tania",
//   title: "Pretty analytical girl",
//   availableResolutions: [],
// };
settings_1.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map