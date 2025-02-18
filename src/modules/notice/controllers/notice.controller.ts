import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { NoticeService } from '../services/notice.service';
import { CreateNoticeDto } from '../dtos/create-notice.dto';
import { UpdateNoticeDto } from '../dtos/update-notice.dto';
import { QueryNoticeDto } from '../dtos/query-notice.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { throwError } from '../../../common/errors/errors.function';
import { ApiTags } from '@nestjs/swagger';
import { UserTypeGuard } from 'src/common/guards/user-type.guard';
import { UserType } from 'src/common/enums/user.enums';
import { UserTypes } from 'src/common/decorators/user-type.decorator';
import { GetUser } from 'src/common/decorators/user.decorator';
import { UserRequest } from 'src/common/dtos/user-req.dto';

@ApiTags('Notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // admin notice create
  @Post('admin/create')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async create(
    @GetUser() userRequest: UserRequest,
    @Body() createDto: CreateNoticeDto
  ) {
    try {
      const data = await this.noticeService.create(userRequest, createDto);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  // admin notice list
  @Get('admin/all')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async findAll(@GetUser() userRequest: UserRequest, @Query() queryDto: QueryNoticeDto) {
    try {
      return await this.noticeService.findAll(userRequest, queryDto);
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  // admin notice find by id
  @Get('admin/:id')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async findOne(@GetUser() userRequest: UserRequest, @Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.noticeService.findOne(userRequest, id);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  // admin notice update
  @Patch('admin/:id')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async update(@GetUser() userRequest: UserRequest, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateNoticeDto) {
    try {
      const data = await this.noticeService.update(userRequest, id, updateDto);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  // admin notice delete
  @Delete('admin/:id')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async remove(@GetUser() userRequest: UserRequest, @Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.noticeService.remove(userRequest, id);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  // agent notice list
  @Get('agent/all')
  @UserTypes(UserType.AGENT)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async agentFindAll(@GetUser() userRequest: UserRequest, @Query() queryDto: QueryNoticeDto) {
    try {
      return await this.noticeService.findAllAgent(userRequest, queryDto);
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }
}
