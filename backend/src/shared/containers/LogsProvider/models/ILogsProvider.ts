import { ILogsDTO } from '../dtos/ILogsDTO';
import Logs from '../implementations/typeorm/schemas/Logs';

export interface ILogsProvider {
  create(data: ILogsDTO): Promise<Logs>;
}
