import { Router } from "express";
import { MainController } from "../controllers/main.controller";
import { JWTService } from "../services/jwt.service";
import { errorWrapper } from "../utils/error-wrapper";

export const mainRouter = Router();

const mainController = new MainController();

mainRouter.post('/page', errorWrapper(mainController.getPage))
mainRouter.put('/page', errorWrapper(JWTService.authorizeJWT), errorWrapper(mainController.insertOrUpdatePage))

mainRouter.post('/request-page', errorWrapper(JWTService.authorizeJWT), errorWrapper(mainController.requestPageForProcessing))
mainRouter.get('/requested-pages', errorWrapper(JWTService.authorizeJWT), errorWrapper(mainController.getRequestedPages))