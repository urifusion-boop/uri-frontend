import { z } from "zod";
import { DateHelper } from "../../helpers/DateHelper";
import BodyFeatureSchema from "./BodyFeatureSchema";
import FileSchema from "./FileSchema";
import LocationSchema from "./LocationSchema";

const ProfileDetailsSchema = z.object({
    gender: z.string().min(1),
    bodyFeature: BodyFeatureSchema,
    dateOfBirth: z.string().min(1).refine((date: string) => DateHelper.isPastDate(date)).optional(),
    languages: z.array(
        z.object({
            language: z.string(),
            proficiency: z.string(),
        })
    ).optional()
});

export default ProfileDetailsSchema;