import { exampleMiddlewareValidationSchema } from "../models/dto/request/ExampleMiddleware.request.dto";
import { getPageValidationSchema } from "../models/dto/request/GetPage.request.dto";
import { insertOrUpdatePageValidationSchema } from "../models/dto/request/InsertOrUpdatePage.request.dto";
import { loginUserValidationSchema } from "../models/dto/request/LoginUser.request.dto";
import { registerUserValidationSchema } from "../models/dto/request/RegisterUser.request.dto";
import { requestPageValidationSchema } from "../models/dto/request/RequestPage.request.dto";

const Schemes:{[key:string]:{[key:string]:Zod.ZodObject<any>}} = {
    POST:{
        "/test": exampleMiddlewareValidationSchema,
        "/register": registerUserValidationSchema,
        "/login": loginUserValidationSchema,
        "/page": getPageValidationSchema,
        "/request-page": requestPageValidationSchema,
    },

    GET:{
        "/example-path": exampleMiddlewareValidationSchema,
    },

    PUT:{
        "/page": insertOrUpdatePageValidationSchema,

    },

    DELETE:{
        
    }
}

export default Schemes;