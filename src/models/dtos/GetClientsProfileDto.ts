import { ClientProfileDto } from "./ClientProfileDto";

export class GetClientsProfileDto {
  page?: string;
  pageSize?: string;
  data?: ClientProfileDto[];
  total?: string;
}
  