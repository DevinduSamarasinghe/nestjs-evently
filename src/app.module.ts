import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';
import { CsrfModule } from './csrf/csrf.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    DatabaseModule,
    UserModule,
    CategoryModule,
    EventModule,

    //middleware modules 
    CsrfModule
  ],
})

export class AppModule {}
