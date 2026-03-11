import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '../lib/prisma.module.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class CategoriesService {
  constructor(@Inject(PRISMA_CLIENT) private prisma: PrismaClient) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = this.generateSlug(createCategoryDto.name);

    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        slug,
      },
      include: {
        products: true,
      },
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(idOrSlug: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    const updateData: any = { ...updateCategoryDto };
    if (updateCategoryDto.name) {
      updateData.slug = this.generateSlug(updateCategoryDto.name);
    }

    return this.prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        products: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Check if category has products
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    // Safely check if products exist and have items
    if (category?.products && category.products.length > 0) {
      throw new Error('Cannot delete category that has products');
    }

    return this.prisma.category.delete({
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
