import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ExcludeNullInterceptor } from './utils/excludeNull.interceptor';
import { HttpExceptionsFilter } from './utils/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ExcludeNullInterceptor());
  app.useGlobalFilters(new HttpExceptionsFilter());
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  await app.listen(3000);
}

bootstrap();
