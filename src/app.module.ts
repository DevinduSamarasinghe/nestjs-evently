import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { CsrfModule } from './csrf/csrf.module';
import { CsrfMiddleware } from './csrf/csrf.middleware';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    UserModule,
    CategoryModule,
    EventModule,
    CsrfModule

  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), CsrfMiddleware)
      .forRoutes("*")
  }
}
