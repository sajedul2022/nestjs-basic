import { registerAs } from '@nestjs/config';

/**
 * Registering app related environment variable as configuration
 *
 *
 * @author Ashadul Mridha <https://github.com/ashadul-mridha>
 * @date 2025-01-24
 */
export default registerAs('app', () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
  version: process.env.API_VERSION,
  sentryDsn: process.env.SENTRY_DSN,
}));
