import Zod from "zod";

//validation schema
export const loginUserValidationSchema = Zod.object({
    username: Zod.string(),
    password: Zod.string(),
})

//type of dto request infered from validation schema
export type LoginUser = Zod.infer<typeof loginUserValidationSchema>