export class RequestOtpDto {
    userId?: string;
    channelType?: string;
}

export class VerifyOtpDto {
    userId?: string;
    channelType?: string;
    data?: string;
}