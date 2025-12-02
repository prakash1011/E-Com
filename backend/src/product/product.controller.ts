import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './create-product.dto';
import { Users } from 'src/components/user/user.entities';
import { UpdateProductDto } from './update-product.dto';
import { AssignPartnerDto } from './assign-partner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 🔐 CREATE still protected (sirf logged in admin/partner)
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) =>
          callback(null, Date.now() + '-' + file.originalname),
      }),
    }),
  )
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: Users,
  ) {
    if (!file) throw new BadRequestException('Image file is required');
    const imagePath = `/uploads/${file.filename}`;
    return this.productService.createWithImage(dto, imagePath, user);
  }

  // 🔓 PUBLIC list – koi auth guard nahi, koi CurrentUser nahi
  @Get('public')
  async list() {
    return this.productService.findAll(); // 👈 sab products
  }

  // yeh GET /products/:id sensitive hai -> ideally guard lagana chahiye
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: Users) {
    const product = await this.productService.findOne(id);
    const allowed = await this.productService.canViewProduct(user, product);
    if (!allowed)
      throw new ForbiddenException('Not allowed to view this product');
    return product;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('partner/:id')
  async listForPartner(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findForPartner(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: Users,
  ) {
    return this.productService.update(id, dto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/assign')
  async assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignPartnerDto,
    @CurrentUser() user: Users,
  ) {
    return this.productService.assignPartner(id, dto, user);
  }
}
