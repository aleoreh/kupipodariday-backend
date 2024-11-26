import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AccessDeniedError } from '../errors/access-denied.error';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  private numberOfLastWishes = 40;
  private numberOfTopWishes = 20;

  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new UserNotFoundError('Пользователь не найден');
    }

    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: user,
      raised: 0,
    });
    const res = await this.wishRepository.save(wish);

    delete res.copied;
    delete res.createdAt;
    delete res.id;
    delete res.offers;
    delete res.owner;
    delete res.raised;
    delete res.updatedAt;

    return res;
  }

  async findAll() {
    return this.wishRepository.find();
  }

  async findLast() {
    return this.wishRepository.find({
      order: { createdAt: 'desc' },
      relations: ['owner'],
      take: this.numberOfLastWishes,
    });
  }

  async findTop() {
    return this.wishRepository.find({
      order: { copied: 'desc' },
      relations: ['owner'],
      take: this.numberOfTopWishes,
    });
  }

  async findOne(id: number) {
    return this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  async findByOwner(ownerId: number) {
    return this.userRepository
      .findOneBy({ id: ownerId })
      .then((user) => this.wishRepository.findBy({ owner: user }));
  }

  async update(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.wishRepository.findOneBy({ id });

    if (wish.owner.id !== userId) {
      throw new AccessDeniedError('Нельзя изменять чужое желание');
    }

    if ('price' in updateWishDto && wish.offers.length > 0) {
      throw new AccessDeniedError(
        'Уже есть желающие скинуться. Нельзя изменить стоимость',
      );
    }

    return this.wishRepository.update({ id }, updateWishDto);
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishRepository.findOneBy({ id });

    if (wish.owner.id !== userId) {
      throw new AccessDeniedError('Нельзя удалять чужие желания');
    }

    if (wish.offers.length > 0) {
      throw new AccessDeniedError(
        'Уже есть желающие скинуться. Удалить нельзя',
      );
    }

    return this.wishRepository.delete({ id });
  }

  async copy(id: number, userId: number) {
    let res: Wish;

    const wish = await this.wishRepository.findOneBy({ id });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: id_, createdAt, updatedAt, copied, raised, ...newWish } = wish;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.wishRepository.save({
        ...wish,
        copied: wish.copied + 1,
        raised: 0,
      });
      res = await this.create(newWish, userId);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }

    return res;
  }
}
