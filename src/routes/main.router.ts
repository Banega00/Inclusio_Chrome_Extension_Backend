import { Router } from "express";
import { MainController } from "../controllers/main.controller";
import { JWTService } from "../services/jwt.service";
import { errorWrapper } from "../utils/error-wrapper";

export const mainRouter = Router();

const mainController = new MainController();

mainRouter.put('/page', errorWrapper(JWTService.authorizeJWT), errorWrapper(mainController.insertOrUpdatePage))
mainRouter.get('/page', errorWrapper(mainController.getPage))