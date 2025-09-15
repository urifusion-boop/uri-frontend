import { SubmitHandler } from "react-hook-form";
import { string, z } from "zod";
import { IFile } from "./clientProfileSetup.hook";

export type ServicesNeededValues = {
  servicesNeeded: string[];
};

export const useServicesNeeded = () => {
  const ServicesNeededSchema = z.object({
    servicesNeeded: string().array(),
  });

  const onSubmit = (data: ServicesNeededValues, callback: () => void) => {
    callback();
  };

  return { ServicesNeededSchema, onSubmit };
};
