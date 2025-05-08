export interface IListQueryParams {
  page: number;
  filters: { [key: string]: string }[];
  sort?: { field: string; order: 'ASC' | 'DESC' };
  results_per_page: number;
}
