import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CartService } from './cart.service.js';
import { AddToCartDto } from './dto/create-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart.dto.js';
import { AuthGuard } from '../common/guards/auth-combined.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':clerkId')
  async getCart(@Param('clerkId') clerkId: string) {
    try {
      return await this.cartService.getCart(clerkId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Return empty cart structure instead of 404 to prevent frontend errors
        return {
          id: null,
          userId: null,
          items: [],
          subtotal: 0,
          totalItems: 0,
        };
      }
      throw error;
    }
  }

  @Post(':clerkId/items')
  async addToCart(
    @Param('clerkId') clerkId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(clerkId, addToCartDto);
  }

  @Patch(':clerkId/items/:itemId')
  async updateCartItem(
    @Param('clerkId') clerkId: string,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(clerkId, itemId, updateCartItemDto);
  }

  @Delete(':clerkId/items/:itemId')
  async removeFromCart(
    @Param('clerkId') clerkId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeFromCart(clerkId, itemId);
  }

  @Delete(':clerkId/clear')
  async clearCart(@Param('clerkId') clerkId: string) {
    return this.cartService.clearCart(clerkId);
  }

  @Get('admin/:userId')
  @Roles('ADMIN')
  async getAnyUserCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }
}
