import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Users } from 'src/components/user/user.entities';
import { Product } from 'src/product/product.entities';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getForUser(userId: number) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.wishlistRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * localStorage wali productIds ko is function se DB ke wishlist me sync karenge
   */
  async syncForUser(userId: number, productIds: number[]) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    // agar empty array bheja to matlab "wishlist clear" bhi maana ja sakta hai
    const uniqueIds = Array.from(new Set(productIds));

    // valid products lao
    const products = uniqueIds.length
      ? await this.productRepo.find({
          where: { id: In(uniqueIds) },
        })
      : [];

    const validIds = products.map((p) => p.id);

    // existing wishlist
    const existing = await this.wishlistRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    const existingIds = existing.map((w) => w.product.id);

    // kaun se add karne hain
    const toAddIds = validIds.filter((id) => !existingIds.includes(id));
    const toRemove = existing.filter((w) => !validIds.includes(w.product.id));

    // add
    if (toAddIds.length) {
      const toAddProducts = products.filter((p) => toAddIds.includes(p.id));
      const newEntities = toAddProducts.map((p) =>
        this.wishlistRepo.create({ user, product: p }),
      );
      await this.wishlistRepo.save(newEntities);
    }

    // remove
    if (toRemove.length) {
      await this.wishlistRepo.remove(toRemove);
    }

    // final updated list return
    return this.getForUser(userId);
  }
}
