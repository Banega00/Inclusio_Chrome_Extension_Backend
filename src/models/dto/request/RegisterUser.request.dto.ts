import Zod from "zod";
import { UserRole } from "../../UserRole.enum";

//validation schema
export const registerUserValidationSchema = Zod.object({
    username: Zod.string(),
    password: Zod.string(),
    role: Zod.nativeEnum(UserRole),
})

//type of dto request infered from validation schema
export type RegisterUser = Zod.infer<typeof registerUserValidationSchema>