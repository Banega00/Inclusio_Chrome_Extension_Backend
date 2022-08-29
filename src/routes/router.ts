import { Router } from "express";
import { mainRouter } from "./main.router";
import { userRouter } from "./user.router";

//This file is Main Router and its usage is to aggregate all other routers

export const router = Router();

router.use(userRouter);
router.use(mainRouter);