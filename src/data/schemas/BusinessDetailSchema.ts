import { z } from "zod";
import FileSchema from "./FileSchema";

const BusinessDetailSchema = z.object({
    name: z.string().min(5),
    type: z.string().min(1),
    category: z.string().min(1),
    coverImage: FileSchema.optional()
});

export default BusinessDetailSchema;