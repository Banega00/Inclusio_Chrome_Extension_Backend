import Zod from "zod";

//validation schema
export const getPageValidationSchema = Zod.object({
    pageUrl: Zod.string().min(1)
})

//type of dto request infered from validation schema
export type GetPage = Zod.infer<typeof getPageValidationSchema>