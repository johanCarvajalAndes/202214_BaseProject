import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TiendaProductoService } from './tienda-producto.service';

@Controller('products')
export class TiendaProductoController {
  constructor(private readonly tiendaProductoService: TiendaProductoService) {}

  @Post(':producto_id/stores/:tienda_id')
  async addStoreToProduct(
    @Param('producto_id') producto_id: string,
    @Param('tienda_id') tienda_id: string,
  ) {
    return await this.tiendaProductoService.addStoreToProduct(
      tienda_id,
      producto_id,
    );
  }
  @Get(':product_id/stores')
  async findStoresFromProduct(@Param('product_id') product_id: string) {
    return await this.tiendaProductoService.findStoresFromProduct(product_id);
  }
  @Get(':product_id/store')
  async findStoreFromProduct(@Param('product_id') product_id: string) {
    return await this.tiendaProductoService.findStoreFromProduct(product_id);
  }
  @Delete(':producto_id/store/:tienda_id')
  @HttpCode(204)
  async deleteStoreFromProduct(
    @Param('producto_id') producto_id: string,
    @Param('tienda_id') tienda_id: string,
  ) {
    return await this.tiendaProductoService.deleteStoreFromProduct(
      producto_id,
      tienda_id,
    );
  }

  @Put(':producto_id/newproduct/:newproduct_id')
  async updateStoresFromProduct(
    @Param('producto_id') producto_id: string,
    @Param('newproduct_id') newproduct_id: string,
  ) {
    return await this.tiendaProductoService.updateStoresFromProduct(
      producto_id,
      newproduct_id,
    );
  }
}
