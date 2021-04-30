import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Base extends BaseEntity {
  @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updateAt: Date;
}
