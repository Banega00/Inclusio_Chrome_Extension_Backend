import { exampleMiddlewareValidationSchema } from "../models/dto/request/ExampleMiddleware.request.dto";

const Schemes:{[key:string]:{[key:string]:Zod.ZodObject<any>}} = {
    POST:{
        "/test": exampleMiddlewareValidationSchema
    },

    GET:{
        "/example-path": exampleMiddlewareValidationSchema
    },

    DELETE:{
        
    }
}

export default Schemes;