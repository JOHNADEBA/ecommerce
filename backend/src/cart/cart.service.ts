import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PRISMA_CLIENT } from '../lib/prisma.module.js';
import { AddToCartDto } from './dto/create-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart.dto.js';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class CartService {
  constructor(@Inject(PRISMA_CLIENT) private prisma: PrismaClient) {}

  async addToCart(clerkId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // ✅ STEP 1: Find the user by clerkId to get the database UUID
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found. Please sync user first.');
    }

    // Check if product exists and has enough inventory
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.inventory < quantity) {
      throw new BadRequestException(
        `Only ${product.inventory} items available in stock`,
      );
    }

    // ✅ STEP 2: Use the database user.id (UUID) for cart operations
    let cart = await this.prisma.cart.findUnique({
      where: { userId: user.id }, // Use database UUID, not clerkId
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId: user.id }, // Use database UUID
      });
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity if item exists
      const newQuantity = existingItem.quantity + quantity;

      if (product.inventory < newQuantity) {
        throw new BadRequestException(
          `Cannot add ${quantity} more. Only ${product.inventory - existingItem.quantity} available`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Create new cart item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // ✅ STEP 3: Return cart data (getCart also needs to handle clerkId)
    return this.getCart(clerkId);
  }

  async getCart(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      // Return empty cart structure
      return {
        id: null,
        userId: user.id,
        items: [],
        subtotal: 0,
        totalItems: 0,
      };
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    return {
      ...cart,
      subtotal,
      totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  async updateCartItem(
    clerkId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const { quantity } = updateCartItemDto;

    // First find the user by clerkId
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the cart item and ensure it belongs to this user
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: {
          include: {
            user: true,
          },
        },
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Verify the cart belongs to the user
    if (cartItem.cart.user.id !== user.id) {
      throw new BadRequestException('Unauthorized');
    }

    // If quantity is undefined, nothing to update
    if (quantity === undefined) {
      return this.getCart(clerkId);
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await this.prisma.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      // Check inventory
      if (cartItem.product.inventory < quantity) {
        throw new BadRequestException(
          `Only ${cartItem.product.inventory} items available in stock`,
        );
      }

      // Update quantity
      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return this.getCart(clerkId);
  }

  async removeFromCart(clerkId: string, itemId: string) {
    // First find the user by clerkId
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the cart item and ensure it belongs to this user
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Verify the cart belongs to the user
    if (cartItem.cart.user.id !== user.id) {
      throw new BadRequestException('Unauthorized');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.getCart(clerkId);
  }

  async clearCart(clerkId: string) {
    // First find the user by clerkId
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return this.getCart(clerkId);
  }
}
