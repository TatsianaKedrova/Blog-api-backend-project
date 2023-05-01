import express from "express";
import {
  addNewUser,
  deleteUser,
  getAllUsers,
} from "../controllers/usersController";
export const usersRouter = express.Router({});

usersRouter.get("/", getAllUsers);
usersRouter.post("/", addNewUser);
usersRouter.delete("/:id", deleteUser);
