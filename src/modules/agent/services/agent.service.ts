import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRequest } from '../../../common/dtos/user-req.dto';
import { throwError } from '../../../common/errors/errors.function';
import { generateRandomString } from '../../../common/helpers/generator.helpers';
import { encryptPassword } from '../../../common/helpers/hash.helpers';
import { RegisterAgentDto } from '../../auth/dtos/register-agent.dto';
import { CreateAgentByAdminOrAgentDto } from '../dtos/create-agent.dto';
import { UpdateAgentDto } from '../dtos/update-agent.dto';
import { AgentEntity } from '../entities/agent.entity';
import { AGENT_AMOUNT_TYPE } from '../enums/agent-amount.enum';
import { AGENT_ROLE } from '../enums/agent-role.enum';
import { AGENT_STATUS } from '../enums/agent-status.enum';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
  ) {}

  selectAgent = [
    'agent.id',
    'agent.parentId',
    'agent.agentId',
    'agent.firstName',
    'agent.lastName',
    'agent.email',
    'agent.phone',
    'agent.company',
    'agent.address',
    'agent.logo',
    'agent.credit',
    'agent.balance',
    'agent.markuptype',
    'agent.markup',
    'agent.role',
    'agent.status',
  ];

  // get all agents
  async getAgents(perPage: number = 10, currentPage: number = 0) {
    // get all agents except password
    const [agents, total] = await this.agentRepository
      .createQueryBuilder('agent')
      .select(this.selectAgent)
      .take(perPage)
      .skip(currentPage * perPage)
      .orderBy('agent.id', 'DESC')
      .getManyAndCount();

    // if no agent found, throw error
    if (!agents.length) {
      throwError(HttpStatus.NOT_FOUND, [], 'No agent found');
    }

    // return response
    return {
      data: agents,
      perPage: perPage,
      currentPage: currentPage + 1,
      totalPage: Math.ceil(total / perPage),
      totalResult: total,
    };
  }

  // get agent by id
  async getAgent(id: number) {
    // get agent by id
    const agent = await this.agentRepository
      .createQueryBuilder('agent')
      .select(this.selectAgent)
      .where('agent.id = :id', { id })
      .getOne();

    // if no agent found, throw error
    if (!agent) {
      throwError(HttpStatus.NOT_FOUND, [], 'agent not found');
    }

    // return response
    return agent;
  }

  // create agent
  async createAgentByAdmin(
    userRequest: UserRequest,
    createAgentByAdminDto: CreateAgentByAdminOrAgentDto,
  ) {
    // check if agent email or phone already exists
    const agent = await this.getAgentByEmailOrPhone(
      createAgentByAdminDto.email,
      createAgentByAdminDto.phone,
    );

    // if no agent found, throw error
    if (agent) {
      throwError(
        HttpStatus.BAD_REQUEST,
        [],
        'agent already exits. Use another email or phone',
      );
    }

    // create new agent
    return await this.agentRepository.save({
      ...createAgentByAdminDto,
      password: await encryptPassword(createAgentByAdminDto.password),
      agentId: generateRandomString(4),
      status: AGENT_STATUS.ACTIVE,
    });
  }

  // update agent
  async updateAgent(id: number, updateAgentDto: UpdateAgentDto) {
    // check agent exits or not
    const agent = await this.getAgent(id);

    // agent not found, throw error
    if (!agent) {
      throwError(HttpStatus.NOT_FOUND, [], 'Agent not found');
    }

    // if you want to update agent email and phone check already exists or not
    if (updateAgentDto.email || updateAgentDto.phone) {
      const agentEmailOrPhoneExits = await this.agentRepository
        .createQueryBuilder('agent')
        .withDeleted()
        .where(
          '(agent.email = :email OR agent.phone = :phone) And agent.id != :id',
          {
            email: updateAgentDto.email,
            phone: updateAgentDto.phone,
            id: id,
          },
        )
        .getOne();

      // if agent found, throw error
      if (agentEmailOrPhoneExits) {
        throwError(
          HttpStatus.BAD_REQUEST,
          [],
          'Agent already exits. Use another email or phone',
        );
      }
    }

    // if markuptype is percentage, then check markup value is less than 100
    if (
      updateAgentDto.markuptype === AGENT_AMOUNT_TYPE.PERCENTAGE &&
      updateAgentDto.markup >= 100
    ) {
      throwError(
        HttpStatus.BAD_REQUEST,
        [],
        'Markup value should be less than 100',
      );
    }

    // update agent
    const updateAgent = await this.agentRepository.update(
      { id },
      {
        ...updateAgentDto,
      },
    );

    // if not updated, throw error
    if (!updateAgent.affected) {
      throwError(HttpStatus.BAD_REQUEST, [], 'agent not updated');
    }

    return await this.getAgent(id);
  }

  // delete Agent
  async deleteAgent(id: number) {
    // check Agent exits or not
    const Agent = await this.getAgent(id);

    const deleteAgent = await this.agentRepository.softDelete({ id });

    // if not deleted, throw error
    if (!deleteAgent.affected) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Agent not deleted');
    }

    return {
      message: 'Agent deleted successfully',
      code: HttpStatus.OK,
      status: true,
    };
  }

  // get agent by email or phone
  async getAgentByEmailOrPhone(email: string, phone: string) {
    const agent = await this.agentRepository
      .createQueryBuilder('agent')
      .where('agent.email = :email OR agent.phone = :phone', {
        email,
        phone,
      })
      .getOne();

    // return response
    return agent;
  }

  // create sub agent by agent
  async createSubAgentByAgent(
    userRequest: UserRequest,
    createAgentByAdminDto: CreateAgentByAdminOrAgentDto,
  ) {
    // check if agent email or phone already exists
    const agent = await this.getAgentByEmailOrPhone(
      createAgentByAdminDto.email,
      createAgentByAdminDto.phone,
    );

    // if no admin found, throw error
    if (agent) {
      throwError(
        HttpStatus.BAD_REQUEST,
        [],
        'agent already exits. Use another email or phone',
      );
    }

    // get parent agent by id
    const parentAgent = await this.getAgent(userRequest.id);

    // count sub agents of parent agent
    const subAgentsCount = await this.agentRepository
      .createQueryBuilder('agent')
      .where('agent.parentId = :parentId', { parentId: userRequest.id })
      .getCount();

    // create new agent
    return await this.agentRepository.save({
      ...createAgentByAdminDto,
      password: await encryptPassword(createAgentByAdminDto.password),
      agentId: parentAgent.agentId
        ? parentAgent.agentId + (Number(subAgentsCount) + 1)
        : generateRandomString(4) + (Number(subAgentsCount) + 1),
      parentId: parentAgent.parentId ? parentAgent.parentId : parentAgent.id,
      role: AGENT_ROLE.SUB_AGENT,
      status: AGENT_STATUS.ACTIVE,
    });
  }

  // get all child agents
  async getChildAgents(
    userRequest: UserRequest,
    perPage: number = 10,
    currentPage: number = 0,
  ) {
    // get request agent
    const agent = await this.getAgent(userRequest.id);

    let parentAgentId = agent.parentId ? agent.parentId : agent.id;

    // get all agents except password
    const [agents, total] = await this.agentRepository
      .createQueryBuilder('agent')
      .select(this.selectAgent)
      .where('agent.parentId = :parentId', { parentId: parentAgentId })
      .take(perPage)
      .skip(currentPage * perPage)
      .orderBy('agent.id', 'DESC')
      .getManyAndCount();

    // if no agent found, throw error
    if (!agents.length) {
      throwError(HttpStatus.NOT_FOUND, [], 'No agent found');
    }

    // return response
    return {
      data: agents,
      perPage: perPage,
      currentPage: currentPage + 1,
      totalPage: Math.ceil(total / perPage),
      totalResult: total,
    };
  }

  // update agent by agent
  async updateAgentByAgent(
    userRequest: UserRequest,
    id: number,
    updateAgentDto: UpdateAgentDto,
  ) {
    // check agent exits or not
    const agent = await this.getAgent(id);

    // agent not found, throw error
    if (!agent) {
      throwError(HttpStatus.NOT_FOUND, [], 'Agent not found');
    }

    // check it is root user or not
    if (agent.parentId === null && agent.id !== userRequest.id) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Parent agent can not be updated');
    }

    const getRequestedAgent = await this.getAgent(userRequest.id);

    // check if agent is sub agent
    if (
      agent.parentId !== userRequest.id &&
      getRequestedAgent.parentId === null
    ) {
      throwError(
        HttpStatus.BAD_REQUEST,
        [],
        'You can update only your sub agents ',
      );
    }

    // check agent and requested agent are under  same parent
    if (
      agent.parentId !== getRequestedAgent.parentId &&
      getRequestedAgent.parentId !== null
    ) {
      throwError(
        HttpStatus.BAD_REQUEST,
        [],
        'You can update only your sub agents ',
      );
    }

    // if you want to update agent email and phone check already exists or not
    if (updateAgentDto.email || updateAgentDto.phone) {
      const agentEmailOrPhoneExits = await this.agentRepository
        .createQueryBuilder('agent')
        .withDeleted()
        .where(
          '(agent.email = :email OR agent.phone = :phone) And agent.id != :id',
          {
            email: updateAgentDto.email,
            phone: updateAgentDto.phone,
            id: id,
          },
        )
        .getOne();

      // if agent found, throw error
      if (agentEmailOrPhoneExits) {
        throwError(
          HttpStatus.BAD_REQUEST,
          [],
          'Agent already exits. Use another email or phone',
        );
      }
    }

    // if markuptype is percentage, then check markup value is less than 100
    if (
      updateAgentDto.markuptype === AGENT_AMOUNT_TYPE.PERCENTAGE &&
      updateAgentDto.markup >= 100
    ) {
      throwError(
        HttpStatus.BAD_REQUEST,
        [],
        'Markup value should be less than 100',
      );
    }

    // update agent
    const updateAgent = await this.agentRepository.update(
      { id },
      {
        ...updateAgentDto,
      },
    );

    // if not updated, throw error
    if (!updateAgent.affected) {
      throwError(HttpStatus.BAD_REQUEST, [], 'agent not updated');
    }

    return await this.getAgent(id);
  }

  // delete Agent
  async deleteAgentByAgent(id: number, userRequest: UserRequest) {
    // check Agent exits or not
    const agent = await this.getAgent(id);

    // agent not found, throw error
    if (!agent) {
      throwError(HttpStatus.NOT_FOUND, [], 'Agent not found');
    }

    // check it is root user or not
    if (agent.parentId === null || agent.parentId === 0) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Parent agent can not be deleted');
    }

    const getRequestedAgent = await this.getAgent(userRequest.id);

    // check if agent is sub agent
    if (
      agent.parentId !== userRequest.id &&
      getRequestedAgent.parentId === null
    ) {
      throwError(
        HttpStatus.BAD_REQUEST,
        [],
        'You can delete only your sub agents ',
      );
    }

    // check agent and requested agent are under  same parent
    if (
      agent.parentId !== getRequestedAgent.parentId &&
      getRequestedAgent.parentId !== null
    ) {
      throwError(
        HttpStatus.BAD_REQUEST,
        [],
        'You can delete only your sub agents ',
      );
    }

    const deleteAgent = await this.agentRepository.softDelete({ id });

    // if not deleted, throw error
    if (!deleteAgent.affected) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Agent not deleted');
    }

    return {
      message: 'Agent deleted successfully',
      code: HttpStatus.OK,
      status: true,
    };
  }

  // update agent profile
  async updateAgentProfile(
    userRequest: UserRequest,
    updateAgentDto: UpdateAgentDto,
  ) {
    // if you want to update agent email and phone check already exists or not
    if (updateAgentDto.email || updateAgentDto.phone) {
      const agentEmailOrPhoneExits = await this.agentRepository
        .createQueryBuilder('agent')
        .withDeleted()
        .where(
          '(agent.email = :email OR agent.phone = :phone) And agent.id != :id',
          {
            email: updateAgentDto.email,
            phone: updateAgentDto.phone,
            id: userRequest.id,
          },
        )
        .getOne();

      // if agent found, throw error
      if (agentEmailOrPhoneExits) {
        throwError(
          HttpStatus.BAD_REQUEST,
          [],
          'Agent already exits. Use another email or phone',
        );
      }
    }

    // if markuptype is percentage, then check markup value is less than 100
    if (
      updateAgentDto.markuptype === AGENT_AMOUNT_TYPE.PERCENTAGE &&
      updateAgentDto.markup >= 100
    ) {
      throwError(
        HttpStatus.BAD_REQUEST,
        [],
        'Markup value should be less than 100',
      );
    }

    // update agent
    const updateAgent = await this.agentRepository.update(
      { id: userRequest.id },
      {
        ...updateAgentDto,
      },
    );

    // if not updated, throw error
    if (!updateAgent.affected) {
      throwError(HttpStatus.BAD_REQUEST, [], 'agent not updated');
    }

    return await this.getAgent(userRequest.id);
  }

  // create
  async insert(registerAgentDto: RegisterAgentDto) {
    try {
      return await this.agentRepository.save({
        firstName: registerAgentDto.firstName,
        lastName: registerAgentDto.lastName,
        email: registerAgentDto.email,
        phone: registerAgentDto.phone,
        password: registerAgentDto.password,
        address: registerAgentDto.address,
        company: registerAgentDto.company,
        agentId: generateRandomString(4),
      });
    } catch (error) {
      throwError(HttpStatus.BAD_REQUEST, [], error.message);
    }
  }
}
