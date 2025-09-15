import { PaginationDto } from './PaginationDto';

export class FeedFilterDto extends PaginationDto {
  posterId?: string;
  category?: string;
  isSpotlight?: boolean;
}
