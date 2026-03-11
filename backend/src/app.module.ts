import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductsModule } from './products/products.module.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './lib/prisma.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { UserModule } from './user/user.module.js';
import { CartModule } from './cart/cart.module.js';
import { AddressModule } from './address/address.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { GuardsModule } from './common/guards/guards.module.js';
import { UploadModule } from './modules/upload/upload.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    GuardsModule,
    ProductsModule,
    CategoriesModule,
    UserModule,
    CartModule,
    AddressModule,
    OrdersModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
