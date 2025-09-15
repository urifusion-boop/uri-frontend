import { UserDto } from "./UserDto";
import { TokenResponseDto } from "./base/TokenResponseDto";

export class LoginResponseDto extends TokenResponseDto {
  user?: UserDto;
}
