import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { IsUrl } from 'class-validator';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @Column()
  @IsUrl()
  item: string;

  @Column('decimal', { scale: 2 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
