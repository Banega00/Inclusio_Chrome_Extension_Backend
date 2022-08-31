import Zod from "zod";

//validation schema
export const publishPageValidationSchema = Zod.object({
    pageUrl: Zod.string().min(1),
})

//type of dto request infered from validation schema
export type PublishPage = Zod.infer<typeof publishPageValidationSchema>