import { IStage } from '@/components/atoms/ProfileStagesContainer';
import { UserRoleEnum } from '@/models/enum-models/UserRoleEnums';
import { UserTypeEnum } from '@/models/enum-models/UserTypeEnum';
import { ISelectData } from '@/types';
import { localGovernments, states } from './statesAndLgas';

export const countries: ISelectData[] = [
  {
    label: 'Nigeria',
    value: 'NIGERIA',
  },
];

export const businessTypes: ISelectData[] = [
  {
    label: 'Sole Proprietorship',
    value: 'SOLE_PROPRIETORSHIP',
  },
  {
    label: 'Partnership',
    value: 'PARTNERSHIP',
  },
  {
    label: 'Limited Liability',
    value: 'LIMITED_LIABILITY',
  },
  {
    label: 'Corporation',
    value: 'CORPORATION',
  },
  {
    label: 'N/A',
    value: 'N/A',
  },
];

export const branchOrHeadOffice: ISelectData[] = [
  {
    label: 'Branch',
    value: 'BRANCH',
  },
  {
    label: 'Head Office',
    value: 'HEAD_OFFICE',
  },
];

export const utilityBill: ISelectData[] = [
  {
    label: 'Electricity bill',
    value: 'ELECTRICITY_BILL',
  },
  {
    label: 'Waste bill',
    value: 'WASTE_BILL',
  },
  {
    label: 'Water bill',
    value: 'WATER_BILL',
  },
  {
    label: 'Land use charge',
    value: 'LAND_USE_CHARGE',
  },
  {
    label: 'Tenancy agreement',
    value: 'TANANCY_AGREEMENT',
  },
];

export const profileStages: IStage[] = [
  {
    name: 'Business Details',
    active: true,
  },
  {
    name: 'Location',
    active: false,
  },
];

export const creativeProfileStages: IStage[] = [
  {
    name: 'Location',
    active: true,
  },
  {
    name: 'Creative Category',
    active: false,
  },
  {
    name: 'Profile Details',
    active: false,
  },
];

export type IdentityMeans = 'NIN' | 'Voter’s card' | 'Driver License' | 'Passport' | '';

export const meansOfIdentification: { label: string; value: IdentityMeans }[] = [
  {
    label: 'NIN',
    value: 'NIN',
  },
  {
    label: 'Voter’s card',
    value: 'Voter’s card',
  },
  {
    label: 'Driver License',
    value: 'Driver License',
  },
  {
    label: 'Passport',
    value: 'Passport',
  },
];

export const suggestedServices = ['Ushering', 'Modeling', 'Catering', 'Photographer/Videograper'];

export const modelCategories = ['Commercial modeling', 'Runway modeling', 'Freelance modeling'];

export const photographySkills = ['Nature photography', 'Editorial Photography', 'Still life Photography'];

export type ICreative = 'model' | 'usher';

export const creativeSkill: { label: string; value: ICreative }[] = [
  {
    label: 'Model',
    value: 'model',
  },
  {
    label: 'Usher',
    value: 'usher',
  },
];

export const genders: ISelectData[] = [
  {
    label: 'Male',
    value: 'Male',
  },
  {
    label: 'Female',
    value: 'Female',
  },
  {
    label: 'Non-Binary',
    value: 'Non-Binary',
  },
  {
    label: 'Prefers not to say',
    value: 'Prefers not to say',
  },
];

export const languages: ISelectData[] = [
  {
    label: 'English',
    value: 'ENGLISH',
  },
  {
    label: 'French',
    value: 'FRENCH',
  },
  {
    label: 'Spanish',
    value: 'SPANISH',
  },
];

export const proficiencies: ISelectData[] = [
  {
    label: 'Basic',
    value: 'BASIC',
  },
  {
    label: 'Conversational',
    value: 'CONVERSATIONAL',
  },
  {
    label: 'Fluent',
    value: 'FLUENT',
  },
  {
    label: 'Native or Bilingual',
    value: 'NATIVE',
  },
];

export const userTypes: ISelectData[] = [
  {
    label: 'Creative',
    value: UserTypeEnum.CREATIVE,
  },
  {
    label: 'Client',
    value: UserTypeEnum.BUSINESS,
  },
];

export const userRoles: ISelectData[] = [
  {
    label: 'User',
    value: UserRoleEnum.USER,
  },
  {
    label: 'Admin',
    value: UserRoleEnum.ADMIN,
  },
  {
    label: 'Super Admin',
    value: UserRoleEnum.SUPER_ADMIN,
  },
];

export const stateOptions = (): ISelectData[] => {
  const stateList = states.map((item) => {
    return {
      label: item.name,
      value: item.name,
    };
  });
  return stateList;
};

export const cityOptions = (state: string): ISelectData[] => {
  // @ts-ignore
  const cityList = localGovernments[state].lgas.map((item) => {
    return {
      label: item,
      value: item,
    };
  });

  return cityList;
};
