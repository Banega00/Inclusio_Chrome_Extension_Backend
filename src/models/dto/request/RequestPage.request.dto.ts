import Zod from "zod";

//validation schema
export const requestPageValidationSchema = Zod.object({
    pageUrl: Zod.string().min(1),
    pageTitle: Zod.string().min(1)
})

//type of dto request infered from validation schema
export type RequestPage = Zod.infer<typeof requestPageValidationSchema>