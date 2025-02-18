import { SetMetadata } from '@nestjs/common';
import { UserType } from '../enums/user.enums';

export const UserTypes = (...args: UserType[]) =>
  SetMetadata('userTypes', args);
