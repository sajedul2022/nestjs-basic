import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserType } from '../../../common/enums/user.enums';
import { throwError } from '../../../common/errors/errors.function';
import { generate6DigitOtp } from '../../../common/helpers/generator.helpers';
import { AdminService } from '../../admin/services/admin.service';
import { AgentReserveService } from '../../agent/services/agent-reserve.service';
import { AgentService } from '../../agent/services/agent.service';
import { OTP_TYPE } from '../../otp/enums/otp.enum';
import { OtpService } from '../../otp/services/otp.service';
import { AdminLoginDto } from '../dtos/admin-login.dto';
import { AgentLoginDto } from '../dtos/agent-login.dto';
import { RegisterAgentDto } from '../dtos/register-agent.dto';
import { VerifyAdminLoginDto } from '../dtos/verify-admin-login.dto';
import { VerifyAgentLoginDto } from '../dtos/verify-agent-login.dto';
import { VerifyAgentRegisterDto } from '../dtos/verify-register-agent.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private otpService: OtpService,
    private adminService: AdminService,
    private agentService: AgentService,
    private agentReserveService: AgentReserveService,
  ) {}

  // login admin
  @Post('admin/login')
  async loginAdmin(@Body() adminLoginDto: AdminLoginDto) {
    try {
      // login admin
      const admin = await this.authService.adminLogin(adminLoginDto);

      // generate otp
      const code = generate6DigitOtp();
      const otp = await this.otpService.create({
        email: admin.email,
        phone: admin.phone,
        code: code,
        type: OTP_TYPE.LOGIN,
        userType: UserType.ADMIN,
      });

      // send otp to user
      return {
        message: 'Otp sent to user',
        data: otp,
      };

      // return response
      return {
        message: 'User logged in successfully',
        data: admin,
      };
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  // verify admin login otp
  @Post('admin/login/verify')
  async verifyAdminOtp(@Body() verifyAdminLoginDto: VerifyAdminLoginDto) {
    try {
      const { emailOrPhone, code } = verifyAdminLoginDto;
      // get admin login otp
      const getOtp = await this.otpService.getLatestOtp(
        emailOrPhone,
        emailOrPhone,
        OTP_TYPE.LOGIN,
        UserType.ADMIN,
      );

      // if not found, throw error
      if (!getOtp) {
        throwError(HttpStatus.NOT_FOUND, [], 'Otp not found');
      }

      // if otp code is not correct, throw error
      if (getOtp.code !== code) {
        throwError(HttpStatus.BAD_REQUEST, [], 'Otp code is not correct');
      }

      // get admin
      const admin = await this.adminService.getAdminByEmailOrPhone(
        emailOrPhone,
        emailOrPhone,
      );

      // if no admin found, throw error
      if (!admin) {
        throwError(HttpStatus.NOT_FOUND, [], 'Admin not found');
      }
      delete admin.password;

      const payload = {
        id: admin.id,
        email: admin.email,
        phone: admin.phone,
        type: UserType.ADMIN,
      };
      return {
        access_token: await this.authService.generateToken(payload),
        admin: admin,
      };
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  // login agent
  @Post('agent/login')
  async loginAgent(@Body() agentLoginDto: AgentLoginDto) {
    try {
      // login agent
      const agent = await this.authService.agentLogin(agentLoginDto);

      // generate otp
      const code = generate6DigitOtp();
      const otp = await this.otpService.create({
        email: agent.email,
        phone: agent.phone,
        code: code,
        type: OTP_TYPE.LOGIN,
        userType: UserType.AGENT,
      });

      // send otp to user
      return {
        message: 'Otp sent to user',
        data: otp,
      };

      // return response
      return {
        message: 'User logged in successfully',
        data: agent,
      };
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  // verify agent login otp
  @Post('agent/login/verify')
  async verifyAgentOtp(@Body() verifyAgentLoginDto: VerifyAgentLoginDto) {
    try {
      const { emailOrPhone, code } = verifyAgentLoginDto;
      // get admin login otp
      const getOtp = await this.otpService.getLatestOtp(
        emailOrPhone,
        emailOrPhone,
        OTP_TYPE.LOGIN,
        UserType.AGENT,
      );

      // if not found, throw error
      if (!getOtp) {
        throwError(HttpStatus.NOT_FOUND, [], 'Otp not found');
      }

      // if otp code is not correct, throw error
      if (getOtp.code !== code) {
        throwError(HttpStatus.BAD_REQUEST, [], 'Otp code is not correct');
      }

      // get agent
      const agent = await this.agentService.getAgentByEmailOrPhone(
        emailOrPhone,
        emailOrPhone,
      );

      // if no admin found, throw error
      if (!agent) {
        throwError(HttpStatus.NOT_FOUND, [], 'Admin not found');
      }
      delete agent.password;

      const payload = {
        id: agent.id,
        email: agent.email,
        phone: agent.phone,
        type: UserType.AGENT,
      };
      return {
        access_token: await this.authService.generateToken(payload),
        admin: agent,
      };
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  // agent register
  @Post('agent/register')
  async registerAgent(@Body() registerAgentDto: RegisterAgentDto) {
    try {
      // check if agent exists
      const agent = await this.agentService.getAgentByEmailOrPhone(
        registerAgentDto.email,
        registerAgentDto.phone,
      );

      // if agent found, throw error
      if (agent) {
        throwError(HttpStatus.BAD_REQUEST, [], 'Agent already exists');
      }

      // store agent reserve
      const agentReserve =
        await this.agentReserveService.create(registerAgentDto);

      // generate otp
      const code = generate6DigitOtp();
      const otp = await this.otpService.create({
        email: registerAgentDto.email,
        phone: registerAgentDto.phone,
        code: code,
        type: OTP_TYPE.REGISTER,
        userType: UserType.AGENT,
      });

      // send otp to user
      return {
        message: 'Otp sent to user',
        data: otp,
      };

      // return response
      return {
        message: 'User logged in successfully',
        data: agent,
      };
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }

  // verify agent register otp
  @Post('agent/register/verify')
  async verifyAgentRegisterOtp(
    @Body() verifyAgentRegisterDto: VerifyAgentRegisterDto,
  ) {
    try {
      const { email, phone, code } = verifyAgentRegisterDto;

      // get agent login otp
      const getOtp = await this.otpService.getLatestOtp(
        email,
        phone,
        OTP_TYPE.REGISTER,
        UserType.AGENT,
      );

      // if not found, throw error
      if (!getOtp) {
        throwError(HttpStatus.NOT_FOUND, [], 'Otp not found');
      }

      // if otp code is not correct, throw error
      if (getOtp.code !== code) {
        throwError(HttpStatus.BAD_REQUEST, [], 'Otp code is not correct');
      }

      // get agent from reserve
      const agentReserve =
        await this.agentReserveService.getAgentReserveByEmailAndPhone(
          email,
          phone,
        );

      // if no agent found, throw error
      if (!agentReserve) {
        throwError(HttpStatus.NOT_FOUND, [], 'Agent not found');
      }

      // store agent
      const agent = await this.agentService.insert({
        ...agentReserve,
      });
      delete agent.password;

      return agent;
    } catch (error) {
      throwError(error.status, error.errors, error.message);
    }
  }
}
