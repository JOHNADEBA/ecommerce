import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PRISMA_CLIENT } from '../lib/prisma.module.js';
import { PrismaClient, Prisma } from '../../generated/prisma/client.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@Injectable()
export class OrdersService {
  constructor(@Inject(PRISMA_CLIENT) private prisma: PrismaClient) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { addressId, items, paymentIntentId, notes } = createOrderDto;

    // Start a transaction to ensure data consistency
    return await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // 1. Verify address belongs to user
        const address = await tx.address.findFirst({
          where: { id: addressId, userId },
        });

        if (!address) {
          throw new BadRequestException('Invalid shipping address');
        }

        // 2. Verify all products exist and have sufficient inventory
        let total = 0;
        const orderItemsData: {
          productId: string;
          quantity: number;
          price: number;
        }[] = [];

        for (const item of items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new BadRequestException(
              `Product ${item.productId} not found`,
            );
          }

          if (product.inventory < item.quantity) {
            throw new BadRequestException(
              `Insufficient inventory for ${product.name}. Available: ${product.inventory}`,
            );
          }

          if (product.price !== item.price) {
            throw new BadRequestException(
              `Price mismatch for ${product.name}. Expected: ${product.price}`,
            );
          }

          total += product.price * item.quantity;

          orderItemsData.push({
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          });
        }

        // 3. Create the order
        const order = await tx.order.create({
          data: {
            userId,
            addressId,
            total,
            paymentIntentId,
            status: 'PENDING',
            ...(notes && { notes }),
            items: {
              create: orderItemsData,
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
            address: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        });

        // 4. Update inventory
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              inventory: {
                decrement: item.quantity,
              },
            },
          });
        }

        // 5. Clear the user's cart
        const cart = await tx.cart.findUnique({
          where: { userId },
        });

        if (cart) {
          await tx.cartItem.deleteMany({
            where: { cartId: cart.id },
          });
        }

        return order;
      },
    );
  }

  async findAll(filters?: {
    userId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const {
      userId,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = filters || {};
    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(orderId: string, userId?: string, isAdmin: boolean = false) {
    const where: any = { id: orderId };

    // If not admin, filter by userId
    if (!isAdmin && userId) {
      where.userId = userId;
    }

    const order = await this.prisma.order.findFirst({
      where,
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
        address: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
    isAdmin: boolean = false,
  ) {
    if (!isAdmin) {
      throw new BadRequestException('Only admins can update order status');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transition
    this.validateStatusTransition(order.status, updateOrderDto.status);

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: updateOrderDto.status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    return this.findAll({ userId, page, limit });
  }

  async cancelOrder(orderId: string, userId: string, isAdmin: boolean = false) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if user owns the order or is admin
    if (!isAdmin && order.userId !== userId) {
      throw new BadRequestException('Unauthorized to cancel this order');
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['PENDING', 'PROCESSING'];
    if (!cancellableStatuses.includes(order.status)) {
      throw new BadRequestException(
        `Order cannot be cancelled in ${order.status} status`,
      );
    }

    // Start transaction to cancel order and restore inventory
    return await this.prisma.$transaction(async (tx) => {
      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });

      // Restore inventory
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            inventory: {
              increment: item.quantity,
            },
          },
        });
      }

      return updatedOrder;
    });
  }

  private validateStatusTransition(currentStatus: string, newStatus: string) {
    const validTransitions = {
      PENDING: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: ['REFUNDED'],
      CANCELLED: [],
      REFUNDED: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  async getOrderStats(userId?: string, isAdmin: boolean = false) {
    const where: any = {};

    if (!isAdmin && userId) {
      where.userId = userId;
    }

    const [totalOrders, totalSpent, ordersByStatus] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.aggregate({
        where,
        _sum: { total: true },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        where,
        _count: true,
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders,
      totalSpent: totalSpent._sum.total || 0,
      ordersByStatus: ordersByStatus.map((status) => ({
        status: status.status,
        count: status._count,
        total: status._sum.total || 0,
      })),
    };
  }
}
