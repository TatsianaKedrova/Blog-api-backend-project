"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_types_1 = require("dto/data.types");
const settings_1 = require("./settings");
require("dotenv").config();
const port = process.env.PORT || 5000;
const something = {
    author: "Tania",
    title: "Pretty analytical girl",
    availableResolutions: [data_types_1.AvailableResolutions.P144],
};
settings_1.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map