import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  let helloMessage = "Great and creative Sherif!";
  res.send(helloMessage);
});