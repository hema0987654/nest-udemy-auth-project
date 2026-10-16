import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Global middlewares
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONT_END_URL]
        : ['http://localhost:3000'],
    Credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const port = 3002;
  await app.listen(process.env.PORT ?? port);
  Logger.log(`🚀 Application is running on port ${port}`);
  Logger.log(`🌍 Environment: ${process.env.NODE_ENV ?? 'development'}`);
}

void bootstrap();
