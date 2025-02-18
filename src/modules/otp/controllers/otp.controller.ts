import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { throwError } from '../../../common/errors/errors.function';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CreateOtpDto } from '../dtos/create-otp.dto';
import { QueryOtpDto } from '../dtos/query-otp.dto';
import { UpdateOtpDto } from '../dtos/update-otp.dto';
import { OtpService } from '../services/otp.service';

@ApiTags('Otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDto: CreateOtpDto) {
    try {
      const data = await this.otpService.create(createDto);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() query: QueryOtpDto) {
    try {
      return await this.otpService.findAll(
        query.perPage && +query.perPage,
        query.currentPage && query.currentPage - 1,
      );
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.otpService.findOne(id);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateOtpDto,
  ) {
    try {
      const data = await this.otpService.update(id, updateDto);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.otpService.remove(id);
      return { success: true, data };
    } catch (error) {
      throwError(error.status, [], error.message);
    }
  }
}
