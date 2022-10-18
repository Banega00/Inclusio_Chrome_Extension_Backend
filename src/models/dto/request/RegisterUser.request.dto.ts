import Zod from "zod";
import { UserRole } from "../../UserRole.enum";

//validation schema
export const registerUserValidationSchema = Zod.object({
    username: Zod.string().min(1),
    password: Zod.string().min(1),
    email: Zod.string().min(1).email(),
    role: Zod.nativeEnum(UserRole),
})

//type of dto request infered from validation schema
export type RegisterUser = Zod.infer<typeof registerUserValidationSchema>