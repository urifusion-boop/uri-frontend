import { z } from "zod";

const BodyFeatureSchema = z.object({
    height: z.string().min(1),
    bodySize: z.string().min(1),
    eyeColor: z.string().min(1),
    skinColor: z.string().min(1)
});

export default BodyFeatureSchema;