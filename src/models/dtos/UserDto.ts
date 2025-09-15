import { AppTokenDto } from './base/AppTokenDto';

export class UserDto {
  id?: string;
  userId?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  gender?: number;
  role?: string;
  country?: string;
  emailConfirmed?: boolean;
  phoneNumber?: string;
  confirmationCode?: string;
  confirmationCodeExpires?: Date;
  hasUsedFreeTrial?: boolean;
  phoneNumberConfirmed?: boolean;
  lastLogin?: number;
  dateCreated?: string;
  userType?: string;
  userStatus?: string;
  pushNotificationSub?: string;
  firebaseSubToken?: string;
  accountType?: string;
  readonly subscriptionStatus?: string;
  appTokens?: AppTokenDto[];
  paystackId?: number;
}
