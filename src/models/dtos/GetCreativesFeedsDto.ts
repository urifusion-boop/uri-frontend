import { FeedDto } from "./FeedDto";

export class GetCreativesFeedsDto {
  page?: string;
  pageSize?: string;
  data?: FeedDto[];
  total?: string;
}
