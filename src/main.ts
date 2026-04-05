import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded } from 'body-parser';
import express, { json } from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { CustomValidationException } from './core/error';
import { LoggerService } from './logger/logger.service';
import { ClusterIoAdapter } from './socket/cluster.io.adapter';
import helmet from 'helmet';

import { webcrypto } from 'crypto';
import useSwaggerUIAuthStoragePlugin from './swagger_plugin';

if (typeof global.crypto === 'undefined') {
  Object.defineProperty(global, 'crypto', {
    value: webcrypto,
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new LoggerService(),
  });

  const configService = app.get(ConfigService);
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  app.use(helmet());

  app.use((req, res, next) => {
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()',
    );
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      exceptionFactory: (validationErrors) => {
        const errors: Record<string, string> = {};
        validationErrors.forEach((err) => {
          errors[err.property] = err.constraints
            ? Object.values(err.constraints).join(`\n`)
            : 'Validation failed';
        });
        return new CustomValidationException(errors);
      },
    }),
  );

  if (!isProduction) {
    const options = new DocumentBuilder()
      .setTitle('NOVASHERE API DOCUMENTATION')
      .setDescription('API endpoints for NOVASHERE portal')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .setVersion('0.1')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        docExpansion: 'none',
        plugins: [useSwaggerUIAuthStoragePlugin()],
      },
    });
  }

  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));
  app.use(express.static(join(process.cwd(), 'public')));

  app.set('trust proxy', true);

  // Only use ClusterIoAdapter if running in a clustered environment
  if (process.env.CLUSTER_MODE === 'true') {
    app.useWebSocketAdapter(new ClusterIoAdapter(app));
  } else {
    console.log('Skipping ClusterIoAdapter: Running in single process');
  }

  app.setBaseViewsDir(join(__dirname, '../..', 'views'));
  app.setViewEngine('ejs');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

bootstrap();
