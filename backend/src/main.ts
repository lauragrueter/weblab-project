import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // prefix for URL
  app.setGlobalPrefix('api');

  // DTO-validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('fitLog API')
    .setDescription('API-Documentation with Swagger')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document); 

  const port = 3000;
  await app.listen(port);

  console.log(`fitLog Backend: http://localhost:${port}/api`);
  console.log(`Swagger: http://localhost:${port}/swagger`);
}
await bootstrap();