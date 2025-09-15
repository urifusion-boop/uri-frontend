import { AppTokenDto } from "./base/AppTokenDto";

export class UpdateUserDto {
  userId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  country?: string;
  pushNotificationSub?: string;
  appToken?: AppTokenDto;
  // Include additional fields as necessary.
}
