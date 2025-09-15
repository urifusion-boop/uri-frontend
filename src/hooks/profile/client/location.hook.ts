import { SubmitHandler } from "react-hook-form";
import { string, z } from "zod";

export type LocationFormValues = {
  businessAddress: string,
  country: string;
  state: string;
  city: string;
};

export const useLocation = () => {
  const LocationSchema = z.object({
    businessAddress: string().min(3, { message: "Address is required." }),
    country: string(),
    state: string(),
    city: string(),
  });

  const onSubmit = (data: LocationFormValues, callback: () => void) => {
    callback()
  };

  return { LocationSchema, onSubmit };
};
