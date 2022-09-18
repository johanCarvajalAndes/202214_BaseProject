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
import { plainToInstance } from 'class-transformer';
import { TiendaDto } from './tienda.dto';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';

@Controller('stores')
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}
  @Get()
  async findAll() {
    return await this.tiendaService.findAll();
  }
  @Get(':tienda_id')
  async findOne(@Param('tienda_id') tienda_id: string) {
    return await this.tiendaService.findOne(tienda_id);
  }
  @Post()
  async create(@Body() tiendaDto: TiendaDto) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendaService.create(tienda);
  }
  @Put(':tienda_id')
  async update(
    @Param('tienda_id') tienda_id: string,
    @Body() tiendaDto: TiendaDto,
  ) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendaService.update(tienda_id, tienda);
  }
  @Delete(':tienda_id')
  @HttpCode(204)
  async delete(@Param('tienda_id') tienda_id: string) {
    return await this.tiendaService.delete(tienda_id);
  }
}
