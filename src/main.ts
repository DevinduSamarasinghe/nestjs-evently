import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { ClerkAuthMiddleware } from './middleware';


async function bootstrap() {


  const configService = new ConfigService();

  //https configurations
  const httpsOptions = {
    key: fs.readFileSync('./private.key'),
    cert: fs.readFileSync('./server.crt')
  };

  //create app and other modules (loggers)
  const app = await NestFactory.create(AppModule,{
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    httpsOptions
  });

  //enabling CORS
  app.enableCors({
    origin: [
      configService.get<string>('LOCAL_HOST'),
      configService.get<string>('PROD_HOST'),
    ],

    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true, // for token to be sent
  })

  //port to listen to
  await app.listen(configService.get<string>('PORT') || 8080);
  
}
bootstrap();
