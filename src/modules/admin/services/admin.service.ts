import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRequest } from '../../../common/dtos/user-req.dto';
import { throwError } from '../../../common/errors/errors.function';
import { encryptPassword } from '../../../common/helpers/hash.helpers';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { UpdateAdminDto } from '../dtos/update-admin.dto';
import { AdminEntity } from '../entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {}

  select: [
    'admin.id',
    'admin.parentId',
    'admin.firstName',
    'admin.lastName',
    'admin.email',
    'admin.phone',
    'admin.role',
    'admin.status',
  ];

  // get all admins
  async getAdmins(perPage: number = 10, currentPage: number = 0) {
    // get all admins except password
    const [admins, total] = await this.adminRepository
      .createQueryBuilder('admin')
      .select([
        'admin.id',
        'admin.parentId',
        'admin.firstName',
        'admin.lastName',
        'admin.email',
        'admin.phone',
        'admin.role',
        'admin.status',
      ])
      .orderBy('admin.id', 'DESC')
      .take(perPage)
      .skip(currentPage * perPage)
      .getManyAndCount();

    // if no admins found, throw error
    if (!admins.length) {
      throwError(HttpStatus.NOT_FOUND, [], 'No admins found');
    }

    // return response
    return {
      data: admins,
      perPage: perPage,
      currentPage: currentPage + 1,
      totalPage: Math.ceil(total / perPage),
      totalResult: total,
    };
  }

  // get admin by id
  async getAdmin(id: number) {
    // get admin by id
    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .select([
        'admin.id',
        'admin.parentId',
        'admin.firstName',
        'admin.lastName',
        'admin.email',
        'admin.phone',
        'admin.role',
        'admin.status',
      ])
      .where('admin.id = :id', { id })
      .getOne();

    // if no admin found, throw error
    if (!admin) {
      throwError(HttpStatus.NOT_FOUND, [], 'Admin not found');
    }

    // return response
    return admin;
  }

  // create admin
  async createAdmin(userRequest: UserRequest, createAdminDto: CreateAdminDto) {
    // check if admin email or phone already exists
    const admin = await this.getAdminByEmailOrPhone(
      createAdminDto.email,
      createAdminDto.phone,
    );

    // if no admin found, throw error
    if (admin) {
      throwError(HttpStatus.NOT_FOUND, [], 'Admin already exits');
    }

    // create new admin
    return await this.adminRepository.save({
      ...createAdminDto,
      password: await encryptPassword(createAdminDto.password),
      parentId: userRequest.id,
    });
  }

  // update admin
  async updateAdmin(id: number, updateAdminDto: UpdateAdminDto) {
    // check admin exits or not
    const admin = await this.getAdmin(id);

    // check it is root user or not
    if (admin.parentId === null || admin.parentId === 0) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Root admin can not be updated');
    }

    const { password, email, phone, ...updateAdminDtoWithoutPassEmail } =
      updateAdminDto;

    // update admin
    const updateAdmin = await this.adminRepository.update(
      { id },
      {
        ...updateAdminDtoWithoutPassEmail,
      },
    );

    // if not updated, throw error
    if (!updateAdmin.affected) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Admin not updated');
    }

    return await this.getAdmin(id);
  }

  // delete admin
  async deleteAdmin(id: number) {
    // check admin exits or not
    const admin = await this.getAdmin(id);

    // check it is root user or not
    if (admin.parentId === null || admin.parentId === 0) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Root admin can not be deleted');
    }

    const deleteAdmin = await this.adminRepository.softDelete({ id });

    // if not deleted, throw error
    if (!deleteAdmin.affected) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Admin not deleted');
    }

    return {
      message: 'Admin deleted successfully',
      code: HttpStatus.OK,
      status: true,
    };
  }

  // get admin by email or phone
  async getAdminByEmailOrPhone(email: string, phone: string) {
    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .where('admin.email = :email OR admin.phone = :phone', {
        email,
        phone,
      })
      .getOne();

    // return response
    return admin;
  }
}
