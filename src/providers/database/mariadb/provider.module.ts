import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DatabaseType } from 'typeorm';
import { MariaDbConfigModule } from '../../../config/database/mysql/config.module';
import { MariaDbConfigService } from '../../../config/database/mysql/config.service';

/**
 *  Mysql Connection Provider Module
 *
 * @author Ashadul Mridha <https://github.com/ashadul-mridha>
 * @date 2025-01-24
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [MariaDbConfigModule],
      inject: [MariaDbConfigService],
      useFactory: async (mariadbConfigService: MariaDbConfigService) => ({
        type: 'mariadb' as DatabaseType,
        host: mariadbConfigService.host,
        port: mariadbConfigService.port,
        username: mariadbConfigService.user,
        password: mariadbConfigService.password,
        database: mariadbConfigService.database,
        autoLoadEntities: true,
      }),
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class MariaDbDatabaseProviderModule {}
