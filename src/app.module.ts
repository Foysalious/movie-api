import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import dbConfig from './config/database.config';
import { UserRepository } from './users/users.repository';
import { MoviesModule } from './movies/movies.module';
import { AuthorizationMiddleware } from './middlewares/authorization.middleware';
import { MoviesController } from './movies/movies.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig()), AuthModule, UsersModule, TypeOrmModule.forFeature([UserRepository]), MoviesModule,],
  controllers: [AppController],
  providers: [AppService,AuthService,JwtService,UsersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes(MoviesController);
  }
}
