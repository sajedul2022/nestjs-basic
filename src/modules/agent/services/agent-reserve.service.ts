import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { encryptPassword } from '../../../common/helpers/hash.helpers';
import { RegisterAgentDto } from '../../auth/dtos/register-agent.dto';
import { AgentReserveEntity } from '../entities/agent-reserve.entity';
import { AgentEntity } from '../entities/agent.entity';

@Injectable()
export class AgentReserveService {
  constructor(
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
    @InjectRepository(AgentReserveEntity)
    private agentReserveRepository: Repository<AgentReserveEntity>,
  ) {}

  // create agent reserve
  async create(registerAgentDto: RegisterAgentDto) {
    return await this.agentReserveRepository.save({
      ...registerAgentDto,
      password: await encryptPassword(registerAgentDto.password),
    });
  }

  // get agent reserve by email and phone
  async getAgentReserveByEmailAndPhone(email: string, phone: string) {
    return await this.agentReserveRepository.findOne({
      where: { email, phone },
      order: { id: 'DESC' },
    });
  }
}
