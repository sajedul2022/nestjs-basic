import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from '../../../common/enums/user.enums';
import { throwError } from '../../../common/errors/errors.function';
import { CreateOtpDto } from '../dtos/create-otp.dto';
import { UpdateOtpDto } from '../dtos/update-otp.dto';
import { OtpEntity } from '../entities/otp.entity';
import { OTP_TYPE } from '../enums/otp.enum';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpEntity)
    private OtpRepository: Repository<OtpEntity>,
  ) {}

  async create(createDto: CreateOtpDto) {
    // if email and phone are not provided, throw error
    if (!createDto.email && !createDto.phone) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Email or phone is required');
    }
    const data = await this.OtpRepository.save(createDto);
    if (!data) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Otp not created');
    }
    return data;
  }

  // get latest otp by email or phone
  async getLatestOtp(
    email: string,
    phone: string,
    type: OTP_TYPE,
    userType: UserType,
  ) {
    const getOtp = await this.OtpRepository.createQueryBuilder('otp')
      .where('otp.email = :email OR otp.phone = :phone', { email, phone })
      .andWhere('otp.type = :type', { type })
      .andWhere('otp.userType = :userType', { userType })
      .orderBy('otp.id', 'DESC')
      .getOne();

    return getOtp;
  }

  async findAll(perPage: number = 10, currentPage: number = 0) {
    const [data, total] = await this.OtpRepository.findAndCount({
      take: perPage,
      skip: perPage * currentPage,
      order: { createdAt: 'DESC' },
    });

    // if data not found, throw error
    if (!data.length) {
      throwError(HttpStatus.NOT_FOUND, [], 'No Otp found');
    }

    // return response
    return {
      data: data,
      perPage: perPage,
      currentPage: currentPage + 1,
      totalPage: Math.ceil(total / perPage),
      totalResult: total,
    };
  }

  async findOne(id: number) {
    const data = await this.OtpRepository.findOne({
      where: { id },
    });
    if (!data) {
      throwError(HttpStatus.NOT_FOUND, [], 'otp Not found');
    }
    return data;
  }

  async update(id: number, updateDto: UpdateOtpDto) {
    //  if (!Object.keys(updateDto).length) {
    //    throw new BadRequestException('must have a property');
    //  }
    //  const updated = await this.updateById(id, updateDto);
    //  if (!updated) {
    //    throw new InternalServerErrorException('update failed');
    //  }
    //  return updated;
  }

  async remove(id: number) {
    const deleteOtp = await this.OtpRepository.delete({ id });
    // if not deleted, throw error
    if (!deleteOtp.affected) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Otp Not deleted');
    }
    return {
      success: true,
      message: 'Otp deleted successfully',
    };
  }
}
