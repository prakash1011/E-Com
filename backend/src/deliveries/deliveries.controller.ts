 import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './createDelivery.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get()
  async list() {
    return this.deliveriesService.findAll();
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.deliveriesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateDeliveryDto, @Req() req: Request) {
    const user = (req.user ?? undefined) as any;
    return this.deliveriesService.create(dto, user);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
    return this.deliveriesService.update(id, dto);
  }
}
