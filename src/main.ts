import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClerkAuthMiddleware } from './middleware';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // Apply Clerk middleware globally
  // app.use(new ClerkAuthMiddleware().use);
  await app.listen(8080);
  
}
bootstrap();
