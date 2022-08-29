import Zod from "zod";

//validation schema
export const exampleMiddlewareValidationSchema = Zod.object({
    content: Zod.any(),
    from: Zod.string().optional(),
    to: Zod.string(),
    templateId: Zod.number().optional(),
    businessId: Zod.union([Zod.number(), Zod.string()])
})

//type of dto request infered from validation schema
export type ExampleMiddleware = Zod.infer<typeof exampleMiddlewareValidationSchema>