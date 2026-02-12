// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Allow Next.js (frontend) on 3000
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('FinXpert API')
    .setDescription('FinXpert backend API docs')
    .setVersion('1.0')
    .addBearerAuth()
    // ✅ Tell Swagger which server to call
    .addServer('http://localhost:3001')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ✅ Backend on 3001 (NOT 3000)
  await app.listen(3001);
  console.log(`🚀 Backend running on http://localhost:3001`);
  console.log(`📚 Swagger on http://localhost:3001/api/docs`);
}
bootstrap();
