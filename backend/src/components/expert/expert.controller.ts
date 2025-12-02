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
import { ExpertService } from './expert.service';
import { CreateUserWithExpertDto } from './create-user-with-expert.dto';
import { UpdateUserWithExpertDto } from './update-user-with-expert.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('expert')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Post('/create')
  async createExpert(@Body() dto: CreateUserWithExpertDto) {
    return this.expertService.createUserWithExpert(dto);
  }

  @Get()
  async getAllExperts() {
    return this.expertService.getAllExperts();
  }

  @Get(':id')
  async getExpertById(@Param('id', ParseIntPipe) id: number) {
    return this.expertService.getExpertById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id')
  async updateExpert(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserWithExpertDto,
  ) {
    return this.expertService.updateExpert(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async removeExpertById(@Param('id', ParseIntPipe) id: number) {
    return this.expertService.removeExpert(id);
  }
}
