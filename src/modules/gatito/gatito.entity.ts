import { Base } from '../../shared/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('gatitos')
export class Gatito extends Base {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @ManyToMany((type) => User, (user) => user.gatitos, { eager: true })
  @JoinColumn()
  authors: User[];
}
