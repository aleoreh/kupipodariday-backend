import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return bcrypt.hash(createUserDto.password, 10).then((hashedPassword) => {
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return this.userRepository.save(user);
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const data = await (updateUserDto.password
      ? bcrypt.hash(updateUserDto.password, 10).then(
          (hashedPassword) =>
            ({
              ...updateUserDto,
              password: hashedPassword,
            }) as UpdateUserDto,
        )
      : updateUserDto);
    await this.userRepository.update({ id }, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
