import Zod from "zod";

//validation schema
export const insertOrUpdatePageValidationSchema = Zod.object({
    pageUrl: Zod.string().min(1),
    altText: Zod.object({

    }),
})

//type of dto request infered from validation schema
export type InsertOrUpdatePage = Zod.infer<typeof insertOrUpdatePageValidationSchema>