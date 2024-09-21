import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // MongooseModule connects to the MongoDB database using the URI from .env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: 'evently', // Your database name
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule], // Make this module's configuration available in other modules
})
export class DatabaseModule {}
