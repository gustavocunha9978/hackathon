import { container } from 'tsyringe';
import { LogsRepository } from './implementations/typeorm/repositories/LogsRepository';
import { ILogsProvider } from './models/ILogsProvider';

container.registerSingleton<ILogsProvider>('LogsProvider', LogsRepository); // typeorm-mongoDB
