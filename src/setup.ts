import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export function setup(app: INestApplication) {
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

  return app;
}
