import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { AdminEntity } from './src/modules/admin/entities/admin.entity';
import { AgentReserveEntity } from './src/modules/agent/entities/agent-reserve.entity';
import { AgentEntity } from './src/modules/agent/entities/agent.entity';
import { OtpEntity } from './src/modules/otp/entities/otp.entity';
import { NoticeEntity } from './src/modules/notice/entities/notice.entity';

config();

export default new DataSource({
  type: 'mariadb',
  host: process.env.MARIADB_HOST,
  port: parseInt(process.env.MARIADB_PORT),
  username: process.env.MARIADB_ROOT_USER,
  password: process.env.MARIADB_ROOT_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  entities: [AdminEntity, OtpEntity, AgentEntity, AgentReserveEntity, NoticeEntity],
  migrationsTableName: 'typeorm_migrations',
  migrations: ['src/database/migrations/*{.ts,.js}'],
});
