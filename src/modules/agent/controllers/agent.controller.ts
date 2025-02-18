import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserTypes } from '../../../common/decorators/user-type.decorator';
import { GetUser } from '../../../common/decorators/user.decorator';
import { QueryDto } from '../../../common/dtos/query.dto';
import { UserRequest } from '../../../common/dtos/user-req.dto';
import { UserType } from '../../../common/enums/user.enums';
import { throwError } from '../../../common/errors/errors.function';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserTypeGuard } from '../../../common/guards/user-type.guard';
import { CreateAgentByAdminOrAgentDto } from '../dtos/create-agent.dto';
import { UpdateAgentDto } from '../dtos/update-agent.dto';
import { AgentEntity } from '../entities/agent.entity';
import { AgentService } from '../services/agent.service';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get()
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async getAdmins(@Query() query: QueryDto) {
    try {
      return this.agentService.getAgents(
        query.perPage && +query.perPage,
        query.currentPage && query.currentPage - 1,
      );
    } catch (error) {
      throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
    }
  }

  // create agent by admin
  @Post('create-by-admin')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async createAgentByAdmin(
    @GetUser() userRequest: UserRequest,
    @Body() createAgentByAdminDto: CreateAgentByAdminOrAgentDto,
  ): Promise<AgentEntity> {
    try {
      return this.agentService.createAgentByAdmin(
        userRequest,
        createAgentByAdminDto,
      );
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  // create agent by agent
  @Post('create-by-agent')
  @UserTypes(UserType.AGENT)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async createSubAgentByAgent(
    @GetUser() userRequest: UserRequest,
    @Body() createAgentByAdminDto: CreateAgentByAdminOrAgentDto,
  ) {
    try {
      const createAgent = await this.agentService.createSubAgentByAgent(
        userRequest,
        createAgentByAdminDto,
      );
      delete createAgent.password;

      return createAgent;
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  // get all child agents by agent
  @Get('child-agents')
  @UserTypes(UserType.AGENT)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async getChildAgents(
    @GetUser() userRequest: UserRequest,
    @Query() query: QueryDto,
  ) {
    try {
      return this.agentService.getChildAgents(
        userRequest,
        query.perPage && +query.perPage,
        query.currentPage && query.currentPage - 1,
      );
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  // update agent data by agent
  @Patch('update-by-agent/:id')
  @UserTypes(UserType.AGENT)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateAgentByAgent(
    @GetUser() userRequest: UserRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    try {
      return this.agentService.updateAgentByAgent(
        userRequest,
        id,
        updateAgentDto,
      );
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  @Delete('delete-agent/:id')
  @UserTypes(UserType.AGENT)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async deleteAgentByAgent(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() userRequest: UserRequest,
  ) {
    try {
      return this.agentService.deleteAgentByAgent(id, userRequest);
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  // update agent profile
  @Patch('update-profile')
  @UserTypes(UserType.AGENT)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateAgentProfile(
    @GetUser() userRequest: UserRequest,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    try {
      return this.agentService.updateAgentProfile(userRequest, updateAgentDto);
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  @Get(':id')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async getAdmin(@Param('id', ParseIntPipe) id: number): Promise<AgentEntity> {
    return this.agentService.getAgent(id);
  }

  @Patch(':id')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateAgent(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    try {
      return this.agentService.updateAgent(id, updateAgentDto);
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  @Delete(':id')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async deleteAdmin(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.agentService.deleteAgent(id);
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }
}
