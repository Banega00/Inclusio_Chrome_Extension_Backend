import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { errorWrapper } from "../utils/error-wrapper";

export const userRouter = Router();

const userController = new UserController();

userRouter.post('/register', errorWrapper(userController.registerUser))
userRouter.post('/login', errorWrapper(userController.loginUser))
// exampleRouter.post('/login', errorWrapper(exampleController.loginUser))
// userRouter.get('/test-http', errorWrapper(exampleController.testHttpMiddleware))
// userRouter.post('/test', errorWrapper(exampleController.testHttpMiddleware))
