export class PagedData<T> {
  page!: number;
  pageSize!: number;
  total!: number;
  data?: T;
}
