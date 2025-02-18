import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from '../dtos/create-notice.dto';
import { UpdateNoticeDto } from '../dtos/update-notice.dto';
import { NoticeEntity } from '../entities/notice.entity';
import { QueryNoticeDto } from '../dtos/query-notice.dto';
import { throwError } from '../../../common/errors/errors.function';
import { UserRequest } from 'src/common/dtos/user-req.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private NoticeRepository: Repository<NoticeEntity>,
  ) {}

  //  Admin create notice
  async create(
    userRequest: UserRequest,
    createDto: CreateNoticeDto
  ) {
    if (!Object.keys(createDto).length) {
      throw new BadRequestException('Must have a input value for notice');
    }
    const data = await this.NoticeRepository.save(createDto);
    if (!data) {
      throw new InternalServerErrorException('Notice not created');
    }
    return data;
  }

  //  Admin find all notices
  async findAll(userRequest: UserRequest, queryDto: QueryNoticeDto) {
    const { perPage, currentPage } = queryDto;
    const [data, total] = await this.NoticeRepository.findAndCount({
      take: +perPage,
      skip: +perPage * (+currentPage - 1),
      order: {
        id: 'DESC',
      },
      select: ['id', 'notice'],
    });
    // if no notices found, throw error
    if (!data.length) {
      throwError(HttpStatus.NOT_FOUND, [], 'No notices found');
    }

    const totalPage = Math.ceil(total / +perPage);
    return {
      data,
      perPage,
      currentPage: +currentPage,
      totalPage,
      totalResult: total,
    };
  }

  //  Admin find notice by id
  async findOne(userRequest: UserRequest, id: number) {
    const data = await this.NoticeRepository.findOne({
      where: { id },
      select: ['id', 'notice'],
    });
    if (!data) {
      throwError(HttpStatus.NOT_FOUND, [], 'Notice not found');
    }
    return data;
  }

  // Admin update notice
  async update(userRequest: UserRequest, id: number, updateDto: UpdateNoticeDto) {
    const data = await this.NoticeRepository.update({ id }, updateDto);
    if (!data.affected) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Notice not updated');
    }
    return {
      success: true,
      message: 'Notice updated successfully',
    };
  }

  // Admin delete notice
  async remove(userRequest: UserRequest, id: number) {
    const deleteNotice = await this.NoticeRepository.delete({ id });
    // if not deleted, throw error
    if (!deleteNotice.affected) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Notice Not deleted');
    }
    return {
      success: true,
      message: 'Notice deleted successfully',
    };
  }

  // agent find all notices
  
  async findAllAgent(userRequest: UserRequest, queryDto: QueryNoticeDto) {
    const { perPage, currentPage } = queryDto;
    const [data, total] = await this.NoticeRepository.findAndCount({
      take: +perPage,
      skip: +perPage * (+currentPage - 1),
      order: {
        id: 'DESC',
      },
      select: ['id', 'notice'],
    });
    // if no notices found, throw error
    if (!data.length) {
      throwError(HttpStatus.NOT_FOUND, [], 'No notices found');
    }

    const totalPage = Math.ceil(total / +perPage);
    return {
      data,
      perPage,
      currentPage: +currentPage,
      totalPage,
      totalResult: total,
    };
  }
}
