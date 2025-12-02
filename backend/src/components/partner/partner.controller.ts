
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreateUserWithPartnerDto } from './create-user-with-partner.dto';
import { UpdateUserWithPartnerDto } from './update-user-with-partner.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('partners') 
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post('') // POST /partners
  async createPartner(@Body() dto: CreateUserWithPartnerDto) {
    return this.partnerService.createUserWithPartner(dto);
  }

  @Get('')
  async getAllPartners() {
    return this.partnerService.getAllPartners();
  }

  @Get(':id')
  async getPartnerById(@Param('id', ParseIntPipe) id: number) {
    return this.partnerService.getPartnerById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async updatePartner(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserWithPartnerDto,
  ) {
    return this.partnerService.updatePartner(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async removePartnerById(@Param('id', ParseIntPipe) id: number) {
    return this.partnerService.removePartner(id);
  }
}
