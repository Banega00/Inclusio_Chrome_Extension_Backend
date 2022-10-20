import Zod from "zod";
import { UserRole } from "../../UserRole.enum";

//validation schema
export const reportVolunteerValidationSchema = Zod.object({
    pageUrl: Zod.string().min(1),
    reasons: Zod.array(Zod.string()).optional()
})

//type of dto request infered from validation schema
export type ReportVolunteer = Zod.infer<typeof reportVolunteerValidationSchema>