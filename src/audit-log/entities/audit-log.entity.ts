import { ExternalLinkOriginEnum } from '@app/iam/enum';
import { User } from '@app/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['entityId', 'userId'])
export class AuditLog {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Index()
  userId: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  ipAddress: string;

  @Column({ nullable: true })
  @Index()
  entityId: string;

  @Column({
    type: 'varchar2',
    enum: ExternalLinkOriginEnum,
    default: ExternalLinkOriginEnum.NOGIC,
  })
  origin: ExternalLinkOriginEnum;

  @Column({ nullable: true })
  entityType: string;

  @Column({ nullable: true })
  entityTitle: string;

  @Column({ type: 'clob', nullable: true })
  changes: string;

  @Column({ nullable: true })
  iv: string;

  @Column('clob', { nullable: true })
  errorDetails: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt?: Date;
  @Column()
  action: string;
}
