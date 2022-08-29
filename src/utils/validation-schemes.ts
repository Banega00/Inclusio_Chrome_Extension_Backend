import { exampleMiddlewareValidationSchema } from "../models/dto/request/ExampleMiddleware.request.dto";
import { registerUserValidationSchema } from "../models/dto/request/RegisterUser.request.dto";

const Schemes:{[key:string]:{[key:string]:Zod.ZodObject<any>}} = {
    POST:{
        "/test": exampleMiddlewareValidationSchema,
        "/register": registerUserValidationSchema
    },

    GET:{
        "/example-path": exampleMiddlewareValidationSchema
    },

    DELETE:{
        
    }
}

export default Schemes;