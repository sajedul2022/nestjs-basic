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
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { UpdateAdminDto } from '../dtos/update-admin.dto';
import { AdminEntity } from '../entities/admin.entity';
import { AdminService } from '../services/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async getAdmins(@Query() query: QueryDto) {
    try {
      return this.adminService.getAdmins(
        query.perPage && +query.perPage,
        query.currentPage && query.currentPage - 1,
      );
    } catch (error) {
      throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
    }
  }

  @Get(':id')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async getAdmin(@Param('id', ParseIntPipe) id: number): Promise<AdminEntity> {
    return this.adminService.getAdmin(id);
  }

  @Post()
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async createAdmin(
    @GetUser() userRequest: UserRequest,
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<AdminEntity> {
    try {
      return this.adminService.createAdmin(userRequest, createAdminDto);
    } catch (error) {
      throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
    }
  }

  @Patch(':id')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    try {
      return this.adminService.updateAdmin(id, updateAdminDto);
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  @Delete(':id')
  @UserTypes(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  async deleteAdmin(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.adminService.deleteAdmin(id);
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }
}
