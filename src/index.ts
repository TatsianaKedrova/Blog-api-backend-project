import express, { Request, Response } from "express";

const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  let helloMessage = "Great and creative Sherif!";
  res.send(helloMessage);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
