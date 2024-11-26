import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOptionsSelect, Like, Repository } from 'typeorm';
import { AlreadyExistsError } from '../errors/already-exists.error';
import { UserNotFoundError } from '../errors/user-not-found.error';
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
    const foundUser = await this.userRepository.findOneBy([
      {
        username: createUserDto.username,
      },
      { email: createUserDto.email },
    ]);

    if (foundUser) {
      throw new AlreadyExistsError(
        'Пользователь с таким email или username уже зарегистрирован',
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
    select?: FindOptionsSelect<User>,
  ) {
    const user = await this.userRepository.findOne({
      where,
      select: { ...select, password: false },
      relations,
    });

    if (!user) {
      throw new UserNotFoundError('Такой пользователь не найден');
    }

    return user;
  }

  async findById(id: number) {
    return this.findOne({ id });
  }

  async findMe(id: number) {
    return this.findOne({ id }, [], {
      about: true,
      avatar: true,
      createdAt: true,
      email: true,
      id: true,
      updatedAt: true,
      username: true,
    });
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
      select: ['id', 'username', 'password'],
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
