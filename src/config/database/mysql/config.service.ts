import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 *  Service Dealing with mysql config based operations
 *
 * @method host()
 * @method password()
 * @method database()
 * @method user()
 * @method password()
 *
 * @author Ashadul Mridha <https://github.com/ashadul-mridha>
 * @date 2025-01-24
 */
@Injectable()
export class MariaDbConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('mariadb.host');
  }

  get port(): number {
    return Number(this.configService.get<number>('mariadb.port'));
  }

  get database(): string {
    return this.configService.get<string>('mariadb.database');
  }

  get user(): string {
    return this.configService.get<string>('mariadb.user');
  }

  get password(): string {
    return this.configService.get<string>('mariadb.password');
  }
}
