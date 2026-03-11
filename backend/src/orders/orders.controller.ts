import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { AuthGuard } from '../common/guards/auth-combined.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('user/:userId')
  @UseGuards(AuthGuard)
  async create(
    @Param('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.ordersService.findAll({
      page: page ? parseInt(page.toString()) : 1,
      limit: limit ? parseInt(limit.toString()) : 10,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  async getUserOrders(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.getUserOrders(
      userId,
      page ? parseInt(page.toString()) : 1,
      limit ? parseInt(limit.toString()) : 10,
    );
  }

  @Get('stats')
  // @UseGuards(AdminGuard)
  async getStats() {
    return this.ordersService.getOrderStats(undefined, true);
  }

  @Get('user/:userId/stats')
  async getUserStats(@Param('userId') userId: string) {
    return this.ordersService.getOrderStats(userId, false);
  }

  @Get(':orderId')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('orderId') orderId: string,
    @Query('userId') userId?: string,
    @Query('isAdmin') isAdmin?: string,
  ) {
    return this.ordersService.findOne(orderId, userId, isAdmin === 'true');
  }

  @Patch(':orderId/status')
  @UseGuards(AuthGuard)
  @Roles('ADMIN')
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderDto,
    @Query('isAdmin') isAdmin?: string,
  ) {
    return this.ordersService.updateStatus(
      orderId,
      updateOrderStatusDto,
      isAdmin === 'true',
    );
  }

  @Delete(':orderId/cancel')
  async cancelOrder(
    @Param('orderId') orderId: string,
    @Query('userId') userId: string,
    @Query('isAdmin') isAdmin?: string,
  ) {
    return this.ordersService.cancelOrder(orderId, userId, isAdmin === 'true');
  }
}
