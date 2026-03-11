import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductFilterDto } from './dto/product-filter.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { AuthGuard } from '../common/guards/auth-combined.guard.js';
import { CloudinaryService } from '../modules/upload/cloudinary.service.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ) {
    // Upload images to Cloudinary
    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      try {
        imageUrls = await this.cloudinaryService.uploadMultipleImages(files);
      } catch (uploadError) {
        console.error('❌ Cloudinary upload failed:', uploadError);
        throw uploadError;
      }
    }

    // Create product with image URLs
    const product = await this.productsService.create({
      ...createProductDto,
      images: imageUrls,
    });

    return product;
  }

  @Get()
  findAll(@Query() filters: ProductFilterDto) {
    return this.productsService.findAll(filters);
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.productsService.findOne(idOrSlug);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 5))
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateProductDto: UpdateProductDto,
    @Body('existingImages') existingImages?: string, // Extract separately
  ) {
    // Get existing product to handle image updates
    const existingProduct = await this.productsService.findOne(id);

    // Parse existing images from JSON string
    let existingImageUrls: string[] = [];
    if (existingImages) {
      try {
        existingImageUrls = JSON.parse(existingImages);
      } catch (error) {
        console.error('❌ Failed to parse existingImages JSON:', error);
      }
    }

    // Upload new images if any
    let newImageUrls: string[] = [];
    if (files && files.length > 0) {
       newImageUrls = await this.cloudinaryService.uploadMultipleImages(files);
      }

    // Combine existing and new images
    const allImageUrls = [...existingImageUrls, ...newImageUrls];
    
    // Delete old images that are no longer used
    if (existingProduct.images && existingProduct.images.length > 0) {
      const imagesToDelete = existingProduct.images.filter(
        (img) => !allImageUrls.includes(img),
      );

      if (imagesToDelete.length > 0) {
         await Promise.all(
          imagesToDelete.map((img) => this.cloudinaryService.deleteImage(img)),
        );
      }
    }

    // Update product with new image URLs
    return this.productsService.update(id, {
      name: updateProductDto.name,
      description: updateProductDto.description,
      price: updateProductDto.price,
      inventory: updateProductDto.inventory,
      categoryId: updateProductDto.categoryId,
      isFeatured: updateProductDto.isFeatured,
      images: allImageUrls,
    });
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    // Get product to delete its images
    const product = await this.productsService.findOne(id);

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map((img) => this.cloudinaryService.deleteImage(img)),
      );
    }
    return this.productsService.remove(id);
  }
}
