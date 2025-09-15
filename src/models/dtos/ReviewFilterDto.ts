import { PaginationDto } from "./PaginationDto";

export class ReviewFilterDto extends PaginationDto {
  receiverId?: string;
  reviewerId?: string;
}
