import { useCallback, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z, string } from "zod";
import useCustomTheme from "@/hooks/theme.hook";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/router";
import { dashboardRoutes } from "@/constants/ClientRoute";
import { ILocation } from "../creative/creativeProfileSetup.hook";
import { CreativeProfileService } from "../../../api/CreativeProfileService";
import { ClientProfileDto } from "../../../models/dtos/ClientProfileDto";

export interface IFile {
  docName: string;
  docType: string;
  publicId: string;
  url: string;
}

export type BusinessDetailsValues = {
  name: string;
  address: string;
  type: string;
  category: string;
  logo: IFile;
};

export interface ClientProfileDtoFormDetails {
  userId: string;
  name: string;
  type: string;
  category: string;
  location: ILocation;
  logo: IFile;
}

export const useClientProfileSetupHook = () => {
  const [loading, setLoading] = useState(false);

  const initialFormDetails = {
    userId: "",
    name: "",
    category: "",
    type: "",
    logo: { docName: "", docType: "", publicId: "", url: "" },
    location: {
      address: "",
      state: "",
      city: "",
      country: "",
    },
  };

  const [formDetails, setFormDetails] =
    useState<ClientProfileDtoFormDetails>(initialFormDetails);

  const { themeColors } = useCustomTheme();

  const BusinessDetailsSchema = z.object({
    name: string().min(3, { message: "Invalid business | client name." }),
    type: string(),
    category: string(),
    logo: z.object({
      publicID: string(),
      url: string(),
    }),
  });

  const onSubmit: SubmitHandler<BusinessDetailsValues> = () => {};

  const { userDetails } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createUserProfile = async () => {
    const data: ClientProfileDto = {
      userId: userDetails?.userId,
      clientType: formDetails?.type === "N/A" ? "INDIVIDUAL" : "COMPANY",
      businessDetail: {
        name: formDetails?.name,
        type: formDetails?.type,
        category: formDetails?.category,
        address: formDetails?.location.address,
      },
      coverImage: {
        docName: formDetails?.logo?.docName,
        docType: formDetails?.logo?.docType ?? "png",
        publicId: formDetails?.logo?.publicId,
        url: formDetails?.logo?.url,
      },
      businessLocation: formDetails?.location,
    };

    setIsLoading(true);
    const response = await CreativeProfileService.updateProfileApi(data);
    setIsLoading(false);

    if (response?.status) {
      router.push(dashboardRoutes?.dashboardClients);
    } else {
      toast(response?.responseMessage);
    }

    return;
  };

  return {
    onSubmit,
    BusinessDetailsSchema,
    loading,
    formDetails,
    setFormDetails,
    createUserProfile,
    isLoading,
  };
};
