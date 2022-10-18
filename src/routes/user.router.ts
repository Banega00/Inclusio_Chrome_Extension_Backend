import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { JWTService } from "../services/jwt.service";
import { errorWrapper } from "../utils/error-wrapper";

export const userRouter = Router();

const userController = new UserController();

userRouter.post('/register', errorWrapper(userController.registerUser))
userRouter.post('/login', errorWrapper(userController.loginUser))
userRouter.put('/preferences', errorWrapper(JWTService.authorizeJWT), errorWrapper(userController.updatePreferences))
// exampleRouter.post('/login', errorWrapper(exampleController.loginUser))
// userRouter.get('/test-http', errorWrapper(exampleController.testHttpMiddleware))
// userRouter.post('/test', errorWrapper(exampleController.testHttpMiddleware))
