import { getMongoRepository, MongoRepository } from 'typeorm';

import { ILogsDTO } from '@shared/containers/LogsProvider/dtos/ILogsDTO';
import { ILogsProvider } from '@shared/containers/LogsProvider/models/ILogsProvider';
import Logs from '../schemas/Logs';

export class LogsRepository implements ILogsProvider {
  private ormRepository: MongoRepository<Logs>;

  constructor() {
    this.ormRepository = getMongoRepository(Logs, 'mongo');
  }

  async create({
    action,
    sector,
    resource,
    user,
    data,
  }: ILogsDTO): Promise<Logs> {
    const log = this.ormRepository.create({
      action,
      sector,
      resource,
      user,
      data,
    });

    await this.ormRepository.save(log);

    return log;
  }
}
