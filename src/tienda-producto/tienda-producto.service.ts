import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from 'src/producto/producto.entity';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TiendaProductoService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}
  async addStoreToProduct(
    tiendaId: string,
    productoId: string,
  ): Promise<TiendaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productoId}, relations: ["tiendas"]});
    if (!producto)
      throw new BusinessLogicException(
        'El producto no existe',
        BusinessError.NOT_FOUND,
      );
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda no existe',
        BusinessError.NOT_FOUND,
      );

    producto.tiendas = [...producto.tiendas, tienda];
    return await this.productoRepository.save(producto);
  }

  async findStoresFromProduct(productoId: string): Promise<TiendaEntity[]> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto no existe',
        BusinessError.NOT_FOUND,
      );

    return producto.tiendas;
  }

  async findStoreFromProduct(productoId: string): Promise<TiendaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto no existe',
        BusinessError.NOT_FOUND,
      );

    return producto.tiendas[0];
  }

  async deleteStoreFromProduct(productoId: string, tiendaId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto no existe',
        BusinessError.NOT_FOUND,
      );
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id: tiendaId },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La tienda no existe',
        BusinessError.NOT_FOUND,
      );
    producto.tiendas = producto.tiendas.filter((e) => e.id !== tiendaId);
    await this.productoRepository.save(producto);
  }
  async updateStoresFromProduct(productoId: string, newProductoId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'El producto no existe',
        BusinessError.NOT_FOUND,
      );
    const newProducto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: newProductoId },
      relations: ['tiendas'],
    });
    if (!newProducto)
      throw new BusinessLogicException(
        'El producto nuevo no existe',
        BusinessError.NOT_FOUND,
      );

    newProducto.tiendas = [...producto.tiendas, ...newProducto.tiendas];
    await this.productoRepository.save(producto);
  }
}
