import { Router } from "express";
import { ExampleController } from "../controllers/example.controller";
import { errorWrapper } from "../utils/error-wrapper";

export const exampleRouter = Router();

const exampleController = new ExampleController();

exampleRouter.post('/register', errorWrapper(exampleController.registerUser))
// exampleRouter.post('/login', errorWrapper(exampleController.loginUser))
exampleRouter.get('/test-http', errorWrapper(exampleController.testHttpMiddleware))
exampleRouter.post('/test', errorWrapper(exampleController.testHttpMiddleware))
