import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Exclude prefixes are used to avoid @Exclude removing properties during
  // plainToInstance, causing getters to use undefined values.
  // This interceptor is only used during serialization (controller return value)
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludePrefixes: ['_'],
    }),
  );

  app.enableCors();
  await app.listen(3000);
}

bootstrap();
