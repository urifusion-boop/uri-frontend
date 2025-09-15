import { PaginationDto } from "./PaginationDto";

export class SearchDto extends PaginationDto {
  searchTerm: string = "";
}