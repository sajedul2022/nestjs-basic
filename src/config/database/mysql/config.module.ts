import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MariaDbConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        MARIADB_HOST: Joi.string().default('mariadb'),
        MARIADB_PORT: Joi.number().default(3306),
        MARIADB_ROOT_USER: Joi.string().default('root'),
        MARIADB_ROOT_PASSWORD: Joi.string().default('password'),
        MARIADB_DATABASE: Joi.string().default('hazitrip'),
      }),
    }),
  ],
  providers: [ConfigService, MariaDbConfigService],
  exports: [ConfigService, MariaDbConfigService],
})
export class MariaDbConfigModule {}
