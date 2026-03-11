import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductFilterDto } from './dto/product-filter.dto.js';
import { PRISMA_CLIENT } from '../lib/prisma.module.js';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class ProductsService {
  constructor(@Inject(PRISMA_CLIENT) private prisma: PrismaClient) {}

  async create(createProductDto: CreateProductDto) {
    let baseSlug = this.generateSlug(createProductDto.name);
    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists and make it unique
    while (true) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { slug },
      });

      if (!existingProduct) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        inventory: createProductDto.inventory,
        categoryId: createProductDto.categoryId,
        images: createProductDto.images || [],
        isFeatured: createProductDto.isFeatured || false,
        slug,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(filters: ProductFilterDto) {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      isFeatured,
      page = 1,
      limit = 10,
    } = filters;

    const currentPage = Number(page);
    const pageSize = Number(limit);
    const skip = (currentPage - 1) * pageSize;

    const where: any = {
      ...(category && { category: { slug: category } }),
      ...(isFeatured !== undefined && { isFeatured: isFeatured === true }), // Add this line
    };

    // Handle price filters
    if (minPrice !== undefined && minPrice !== null) {
      where.price = { ...where.price, gte: Number(minPrice) };
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      where.price = { ...where.price, lte: Number(maxPrice) };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(idOrSlug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto & { images?: string[] },
  ) {
    await this.findOne(id);

    const updateData: any = { ...updateProductDto };

    // Ensure isFeatured is always a boolean, never undefined
    if (updateProductDto.isFeatured !== undefined) {
      updateData.isFeatured = updateProductDto.isFeatured === true;
    }

    if (updateProductDto.name) {
      updateData.slug = this.generateSlug(updateProductDto.name);
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
