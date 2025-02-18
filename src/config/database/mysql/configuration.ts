import { registerAs } from '@nestjs/config';

/**
 * Registering mysql related environment variable as configuration
 *
 * @author Ashadul Mridha <https://github.com/ashadul-mridha>
 * @date 2025-01-24
 */
export default registerAs('mariadb', () => ({
  host: process.env.MARIADB_HOST,
  port: process.env.MARIADB_PORT,
  database: process.env.MARIADB_DATABASE,
  user: process.env.MARIADB_ROOT_USER,
  password: process.env.MARIADB_ROOT_PASSWORD,
}));
