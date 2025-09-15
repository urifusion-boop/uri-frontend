import { z } from "zod";

export const portfolioSchema = z.object({
  userId: z.string(),
  category: z.string().min(1),
  experience: z.object({
    role: z.string().min(1),
    businessName: z.string().min(1),
    startDate: z.string(),
    endDate: z.string(),
    location: z.object({
      country: z.string().min(1),
      state: z.string().min(1),
      city: z.string().min(1),
      address: z.string().min(1),
    }),
    isCurrent: z.boolean().default(false),
    description: z.string().min(1),
  }),
  media: z.object({
    docName: z.string().min(1),
    docType: z.string().min(1),
    publicId: z.string().min(1),
    url: z.string().min(1),
  }),
  coverImage: z.object({
    docName: z.string().min(1),
    docType: z.string().min(1),
    publicId: z.string().min(1),
    url: z.string().min(1),
  }),
});

export type PortfolioSchemaType = z.infer<typeof portfolioSchema>;
