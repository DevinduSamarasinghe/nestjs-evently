import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {

  const configService = new ConfigService();

  //create app and other modules (loggers)
  const app = await NestFactory.create(AppModule,{
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  
  //enabling CORS
  app.enableCors({
    origin: [
      configService.get<string>('LOCAL_HOST'),
      configService.get<string>('PROD_HOST'),
    ],
    
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true, // for token to be sent
  });

  app.use(cookieParser());

  //port to listen to
  await app.listen(configService.get<string>('PORT') || 8080);
  
}
bootstrap();
