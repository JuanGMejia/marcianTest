// infrastructure.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';


import { InfrastructureService } from './app.service';
import { CreateOrderDto } from './events.gateway';

@Controller('mars-api')
export class InfrastructureController {
  constructor(private readonly infraService: InfrastructureService) { }

  @Get('inventory')
  getInventory() {
    return this.infraService.getInventory();
  }

  @Get('history')
  getHistory() {
    return this.infraService.getHistory();
  }

  @Post('order')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.infraService.processOrder(createOrderDto);
  }
}