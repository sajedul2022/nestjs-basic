import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentController } from './controllers/agent.controller';
import { AgentReserveEntity } from './entities/agent-reserve.entity';
import { AgentEntity } from './entities/agent.entity';
import { AgentReserveService } from './services/agent-reserve.service';
import { AgentService } from './services/agent.service';

@Module({
  imports: [TypeOrmModule.forFeature([AgentEntity, AgentReserveEntity])],
  controllers: [AgentController],
  providers: [AgentService, AgentReserveService],
  exports: [AgentService, AgentReserveService],
})
export class AgentModule {}
