import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { CreativeProfileService } from "@/api/CreativeProfileService";
import { dashboardRoutes } from "@/constants/ClientRoute";
import { useAuth } from "@/providers/AuthProvider";
import { IFile } from "../client/clientProfileSetup.hook";
import { CreativeProfileDto } from "../../../models/dtos/CreativeProfileDto";

export interface ILocation {
  country: string;
  state: string;
  city: string;
  address: string;
}

export interface ILanguage {
  language: string;
  proficiency: string;
}

export interface IBodyFeature {
  height: string;
  bodySize: string;
  eyeColor: string;
  skinColor: string;
}

export interface CreativeProfileFormDetails {
  userId: string;
  creativeCategories: string[];
  bodyFeature: IBodyFeature;
  dateOfBirth: string;
  gender: string;
  location: ILocation;
  languages: ILanguage[];
  images: IFile[];
  headshot: IFile;
}

export const useCreativeProfileSetup = () => {
  const initialFormDetails: CreativeProfileFormDetails = {
    userId: "",
    location: {
      address: "",
      state: "",
      city: "",
      country: "",
    },
    creativeCategories: [],
    bodyFeature: {
      height: "5ft",
      bodySize: "",
      skinColor: "",
      eyeColor: "",
    },
    languages: [],
    headshot: {
      docName: "",
      docType: "",
      publicId: "",
      url: "",
    },
    gender: "",
    images: [],
    dateOfBirth: "",
  };

  const [formDetails, setFormDetails] =
    useState<CreativeProfileFormDetails>(initialFormDetails);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { userDetails } = useAuth();

  const onSubmit = async () => {
    const data: CreativeProfileDto = {
      userId: userDetails?.userId,
      creativeCategories: formDetails?.creativeCategories,
      bodyFeature: formDetails?.bodyFeature,
      dateOfBirth: formDetails?.dateOfBirth,
      gender: formDetails?.gender,
      headshot: formDetails?.headshot,
      languages: formDetails?.languages,
      images: formDetails?.images,
      location: formDetails?.location,
    };

    const response = await CreativeProfileService.updateProfileApi(data);

    if (response?.status) {
      router.push(dashboardRoutes?.dashboardCreatives);
    } else {
      toast(response?.responseMessage);
    }

    return;
  };

  return { formDetails, setFormDetails, onSubmit };
};
