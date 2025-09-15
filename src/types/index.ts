import { ClientProfileDto } from '@/models/dtos/ClientProfileDto';
import { CreativeProfileDto } from '@/models/dtos/CreativeProfileDto';
import { IFile } from '../hooks/profile/client/clientProfileSetup.hook';
import { IBodyFeature, ILanguage, ILocation } from '../hooks/profile/creative/creativeProfileSetup.hook';

export interface ISelectData {
  label: string;
  value: string | number;
}

export interface IStatusWithData<T> {
  status: number;
  data: T;
}

export interface IApiResponse<T = null> {
  status: 'SUCCESS' | 'FAILED';
  message: string;
  success: boolean;
  data: T | null;
}

export interface ITokenDetails {
  accessToken: string;
  refreshToken: string;
}

export interface IUserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  gender: string;
  dateCreated: string;
  password: string;
  userStatus: string;
  confirmationCode: string;
  confirmationCodeExpires: string;
  userId: string;
  emailConfirmed?: boolean;
  userType: string;
}

export interface ITokenDetails {
  accessToken: string;
  refreshToken: string;
}

export interface IClientProfile {
  userId: string;
  gender?: string;
  dateOfBirth?: string;
  businessLocation?: ILocation;
  headshot?: IFile;
  images?: IFile[];
  bodyFeature?: IBodyFeature;
  languages?: ILanguage[];
  creativeCategories?: string[];
  clientType?: string;
  businessDetail?: {
    name: string;
    type: string;
    address: string;
    category: string;
  };
  businessDoc?: IFile[];
  coverImage?: IFile;
  logo?: IFile;
  serviceRequirements?: string[];
  user?: Partial<IUserDetails>;
}

export interface ICreativeProfile {
  userId: string;
  gender?: string;
  dateOfBirth?: string;
  location?: {
    country: string;
    state: string;
    city: string;
    address: string;
  };
  headshot?: IFile;
  images?: IFile[];
  coverImage?: IFile;
  bodyFeature?: IBodyFeature;
  languages?: ILanguage[];
  creativeCategories?: string[];
  user?: Partial<IUserDetails>;
}

export interface IPortfolio {
  userId: string;
  category: string;
  experience: IExperience;
  media: ICoverImage;
  coverImage: ICoverImage;
}

export interface ICoverImage {
  docName: string;
  docType: string;
  publicId: string;
  url: string;
}

export interface IExperience {
  role: string;
  businessName: string;
  startDate: Date;
  endDate: Date;
  location: Location;
  isCurrent: boolean;
  description: string;
}

export type SignupFormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
  token: string;
};

export type Tab = 'creative' | 'client' | '';

export type ItemType = {
  image: React.ReactNode;
  hoverImage?: React.ReactNode;
  title: string;
  text: string;
  buttonText: string;
  identify: Tab;
};

export type ClientProfileProps = {
  clientProfile: ClientProfileDto;
};

export type CreativeProfileProps = {
  creativeProfile: CreativeProfileDto | null;
};
