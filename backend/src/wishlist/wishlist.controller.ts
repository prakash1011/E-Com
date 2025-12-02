import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { SyncWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Users } from 'src/components/user/user.entities';

@UseGuards(AuthGuard('jwt'))
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // GET /wishlist  -> current user ki wishlist
  @Get()
  getMyWishlist(@CurrentUser() user: Users) {
    return this.wishlistService.getForUser(user.id);
  }

  // POST /wishlist/sync  -> localStorage se IDs laa ke sync
  @Post('sync')
  syncMyWishlist(@Body() dto: SyncWishlistDto, @CurrentUser() user: Users) {
    return this.wishlistService.syncForUser(user.id, dto.productIds);
  }
}
