import { IsUrl, Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column({ default: '' })
  @IsUrl()
  link: string;

  @Column({ default: '' })
  @IsUrl()
  image: string;

  @Column('decimal', { scale: 2 })
  price: number;

  @Column('decimal', { scale: 2, default: 0 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({ default: '' })
  @Length(1, 1024)
  description: string;

  @Column('text', { array: true, default: [] })
  offers: string[];

  @Column('decimal', { scale: 2, default: 0 })
  copied: number;
}
