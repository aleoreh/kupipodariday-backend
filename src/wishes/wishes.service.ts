import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessDeniedError } from '../errors/access-denied.error';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { UserNotFoundError } from '../errors/user-not-found.error';

@Injectable()
export class WishesService {
  private numberOfLastWishes = 40;
  private numberOfTopWishes = 20;

  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new UserNotFoundError('Пользователь не найден');
    }

    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: user,
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
      relations: { owner: true },
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
      throw new AccessDeniedError('Нельзя редактировать чужие желания');
    }

    if ('price' in updateWishDto && wish.offers.length > 0) {
      throw new AccessDeniedError(
        'Уже есть желающие скинуться. Ничего изменить стоимость',
      );
    }

    return this.wishRepository.update({ id }, updateWishDto);
  }

  async remove(id: number) {
    const wish = await this.wishRepository.findOneBy({ id });

    if (wish.offers.length > 0) {
      throw new AccessDeniedError(
        'Уже есть желающие скинуться. Удалить нельзя',
      );
    }

    return this.wishRepository.delete({ id });
  }
}
