import Zod from "zod";

//validation schema
export const loginUserValidationSchema = Zod.object({
    username: Zod.string().min(1),
    password: Zod.string().min(1),
})

//type of dto request infered from validation schema
export type LoginUser = Zod.infer<typeof loginUserValidationSchema>