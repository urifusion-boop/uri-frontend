import { ITokenDetails } from "../../types";
import { UserDto } from "./UserDto";

export class GoogleSignUpResponse {
    user?: UserDto;
    accessToken?: string;
    refreshToken?: string;
}