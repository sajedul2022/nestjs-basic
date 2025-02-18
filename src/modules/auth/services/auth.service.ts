import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { throwError } from '../../../common/errors/errors.function';
import { comparePassword } from '../../../common/helpers/hash.helpers';
import { AdminService } from '../../admin/services/admin.service';
import { AgentService } from '../../agent/services/agent.service';
import { AdminLoginDto } from '../dtos/admin-login.dto';
import { AgentLoginDto } from '../dtos/agent-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private agentService: AgentService,
    private jwtService: JwtService,
  ) {}

  // admin login user
  async adminLogin(adminLoginDto: AdminLoginDto) {
    const { emailOrPhone, password } = adminLoginDto;
    // check if user exists
    const admin = await this.adminService.getAdminByEmailOrPhone(
      emailOrPhone,
      emailOrPhone,
    );

    // if no admin found, throw error
    if (!admin) {
      throwError(HttpStatus.NOT_FOUND, [], 'Admin not found');
    }

    // check if password is correct
    const isPasswordMatch = await comparePassword(password, admin.password);

    // if password is not correct, throw error
    if (!isPasswordMatch) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Incorrect  password');
    }

    // send otp to user

    delete admin.password;
    return admin;
    // const payload = {
    //   id: admin.id,
    //   email: admin.email,
    //   phone: admin.phone,
    //   type: UserType.ADMIN,
    // };
    // return {
    //   access_token: await this.generateToken(payload),
    //   admin: admin,
    // };
  }

  // agent login user
  async agentLogin(agentLoginDto: AgentLoginDto) {
    const { emailOrPhone, password } = agentLoginDto;
    // check if user exists
    const agent = await this.agentService.getAgentByEmailOrPhone(
      emailOrPhone,
      emailOrPhone,
    );

    // if no agent found, throw error
    if (!agent) {
      throwError(HttpStatus.NOT_FOUND, [], 'Agent not found');
    }

    // check if password is correct
    const isPasswordMatch = await comparePassword(password, agent.password);

    // if password is not correct, throw error
    if (!isPasswordMatch) {
      throwError(HttpStatus.BAD_REQUEST, [], 'Incorrect  password');
    }

    // send otp to user

    delete agent.password;
    return agent;
    // const payload = {
    //   id: admin.id,
    //   email: admin.email,
    //   phone: admin.phone,
    //   type: UserType.ADMIN,
    // };
    // return {
    //   access_token: await this.generateToken(payload),
    //   admin: admin,
    // };
  }

  // admin login otp verification
  async adminLoginOtpVerification() {
    // verify otp
  }

  // generate jwt token
  public async generateToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
  }
}
