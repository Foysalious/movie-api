import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';
require('dotenv').config()

export default registerAs(
  'typeOrmConfig',
  (): TypeOrmModuleOptions => ({
    type: 'mongodb',
    url: process.env.MONGO_DSN || 'mongodb://localhost:27017/movie_collection',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
  }),
);
