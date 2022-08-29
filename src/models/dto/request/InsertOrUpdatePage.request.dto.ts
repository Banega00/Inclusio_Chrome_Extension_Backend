import Zod from "zod";

//validation schema
export const insertOrUpdatePageValidationSchema = Zod.object({
    pageUrl: Zod.string(),
    altText: Zod.object({

    }),
})

//type of dto request infered from validation schema
export type InsertOrUpdatePage = Zod.infer<typeof insertOrUpdatePageValidationSchema>