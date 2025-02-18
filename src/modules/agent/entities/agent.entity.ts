import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AGENT_ROLE } from '../enums/agent-role.enum';
import { AGENT_STATUS } from '../enums/agent-status.enum';

@Entity('agent')
export class AgentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'int' })
  parentId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  agentId: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  company: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  phone: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 560, nullable: true })
  logo: string;

  @Column({ type: 'int', default: 0 })
  credit: number;

  @Column({ type: 'bigint', default: 0 })
  balance: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  markuptype: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  markup: number;

  // @Column({ type: 'varchar', length: 255, nullable: true })
  // clientmarkuptype: string;

  // @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  // clientmarkup: number;

  @Column({ type: 'boolean', default: false })
  partialEligibility: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  partialEligibilityValue: number;

  @Column({ type: 'int', default: 0 })
  searchlimit: number;

  @Column({ type: 'varchar', length: 560, nullable: true })
  nid: string;

  @Column({ type: 'varchar', length: 560, nullable: true })
  tradelicense: string;

  @Column({ type: 'varchar', length: 560, nullable: true })
  civilAviationNo: string;

  @Column({ type: 'varchar', length: 560, nullable: true })
  accKeyManager: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', length: 255, default: AGENT_ROLE.MAIN_AGENT })
  role: string;

  @Column({ type: 'varchar', length: 255, default: AGENT_STATUS.PENDING })
  status: string;
}
