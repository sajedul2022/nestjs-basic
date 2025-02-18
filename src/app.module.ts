import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/config.module';
import { RabbitmqModule } from './config/rabbitmq/rabbitmq.module';
import { SmtpModule } from './config/smtp/smtp.module';
import { AdminModule } from './modules/admin/admin.module';
import { AgentModule } from './modules/agent/agent.module';
import { AuthModule } from './modules/auth/auth.module';
import { MariaDbDatabaseProviderModule } from './providers/database/mariadb/provider.module';
import { NoticeModule } from './modules/notice/notice.module';

@Module({
  imports: [
    AppConfigModule,
    MariaDbDatabaseProviderModule,
    RabbitmqModule,
    MongooseModule.forRoot(process.env.DB_URL),
    SmtpModule,
    AuthModule,
    AdminModule,
    NoticeModule
    AgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
