import Zod from "zod";

//validation schema
export const updatePreferencesValidationSchema = Zod.object({})

//type of dto request infered from validation schema
export type UpdatePreferences = Zod.infer<typeof updatePreferencesValidationSchema>