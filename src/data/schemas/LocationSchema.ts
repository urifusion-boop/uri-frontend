import { z } from "zod";

const LocationSchema = z.object({
  country: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1, "Address is required"),
});

export default LocationSchema;
