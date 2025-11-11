import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
const app = await NestFactory.create(AppModule);

  // Enable global validation for all DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // --- REST API (Swagger) Setup ---
  const config = new DocumentBuilder()
    .setTitle('E-commerce Admin API')
    .setDescription('API documentation for admin operations')
    .setVersion('1.0')
    .addBearerAuth() // For JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Access at /api-docs

  await app.listen(3000);
}
bootstrap();