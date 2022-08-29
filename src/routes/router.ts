import { Router } from "express";
import { exampleRouter } from "./example.router";

//This file is Main Router and its usage is to aggregate all other routers

export const router = Router();

router.use(exampleRouter);