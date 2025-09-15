import { z } from "zod";

const PersonalDetailsSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2)
});

export default PersonalDetailsSchema;