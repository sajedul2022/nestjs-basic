import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ADMIN_ROLE } from '../enums/admin-role.enum';
import { ADMIN_STATUS } from '../enums/admin-status.enum';

@Entity('admin')
export class AdminEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'int' })
  parentId: number;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  phone: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'varchar', length: 255, default: ADMIN_ROLE.ADMIN })
  role: string;

  @Column({ type: 'varchar', length: 255, default: ADMIN_STATUS.ACTIVE })
  status: string;
}
