import { Routes } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { doctorsController } from "../controllers/users/doctorsController.js";

export const usersRoutes = Routes();

usersRoutes.get("/doctors", asyncHandler(doctorsController));
