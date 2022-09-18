import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

@Controller('products')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}
  @Get()
  async findAll() {
    return await this.productoService.findAll();
  }
  @Get(':product_id')
  async findOne(@Param('product_id') product_id: string) {
    return await this.productoService.findOne(product_id);
  }
  @Post()
  async create(@Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.create(producto);
  }
  @Put(':producto_id')
  async update(
    @Param('producto_id') producto_id: string,
    @Body() productoDto: ProductoDto,
  ) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.update(producto_id, producto);
  }
  @Delete(':producto_id')
  @HttpCode(204)
  async delete(@Param('producto_id') producto_id: string) {
    return await this.productoService.delete(producto_id);
  }
}
