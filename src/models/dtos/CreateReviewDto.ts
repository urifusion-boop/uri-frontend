export class CreateReviewDto {
  posterId?: string;
  posterType?: string;
  posterFirstName?: string;
  posterLastName?: string;
  posterImage?: string;
  receiverId?: string;
  receiverType?: string;
  comment?: string;
  rating?: number;
}
