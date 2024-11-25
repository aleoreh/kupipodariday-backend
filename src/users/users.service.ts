import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Like, Repository } from 'typeorm';
import { AlreadyExistsError } from '../errors/already-exists.error';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const foundUser = await this.userRepository.findOneBy([
      {
        username: createUserDto.username,
      },
      { email: createUserDto.email },
    ]);

    if (foundUser) {
      throw new AlreadyExistsError(
        'Пользователь с таким именем или электронной почтой уже есть!',
      );
    }

    return bcrypt.hash(createUserDto.password, 10).then((hashedPassword) => {
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return this.userRepository.save(user);
    });
  }

  async findOne(
    where: { id: number } | { username: string },
    relations: 'wishes'[] = [],
  ) {
    return this.userRepository.findOne({
      where,
      select: { password: false },
      relations,
    });
  }

  async findById(id: number) {
    return this.findOne({ id });
  }

  async findByIdWithWishes(id: number) {
    return this.findOne({ id }, ['wishes']);
  }

  async findByUsername(username: string): Promise<User> {
    return this.findOne({ username });
  }

  async findByUsernameWithWishes(username: string): Promise<User> {
    return this.findOne({ username }, ['wishes']);
  }

  async findOneForAuthByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: { username },
    });
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
    return this.findById(id);
  }

  async remove(id: number) {
    return this.userRepository.delete({ id });
  }

  async find(query: string) {
    return this.userRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }

  async getUserWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });
    return user.wishes;
  }
}
