import { DataSource } from 'typeorm';
import path from 'path';

export const createPostgresConnection = new DataSource({
  name: process.env.DB_NAME,
  url: process.env.DB_URL,
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: [
    path.join(
      __dirname,
      '../',
      '../',
      '../',
      '../',
      process.env.NODE_ENV === 'development' ? 'src' : 'dist',
      'infra',
      '**',
      'typeorm',
      'entities',
      process.env.NODE_ENV === 'development' ? '*.ts' : '*.js',
    ),
  ],
  // migrations: [
  //   path.join(
  //     __dirname,
  //     process.env.NODE_ENV === 'development' ? 'src' : 'dist',
  //     'shared',
  //     'infra',
  //     'typeorm',
  //     'migrations',
  //     process.env.NODE_ENV === 'development' ? '*.ts' : '*.js',
  //   ),
  // ],

  logging: true,

  ssl: false,
});

createPostgresConnection
  .initialize()
  .then(() => console.log('Conexão com Postgres Iniciada'));
