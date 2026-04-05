import { LoggerService } from '@app/logger/logger.service';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { config } from 'dotenv';

config();

const logger = new LoggerService();
const SENTRY_DSN = process.env.SENTRY_URL;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_URL,
    environment: process.env.NODE_ENV,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.05,
  });
} else {
  logger.warn('Sentry is NOT enabled', 'Sentry');
}
