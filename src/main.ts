import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
    }),
  );
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
