export interface ILogsDTO {
  action: 'inserted' | 'updated' | 'deleted';
  sector: 'education' | 'Directors';
  resource: string;
  user: string;
  data: unknown;
}
