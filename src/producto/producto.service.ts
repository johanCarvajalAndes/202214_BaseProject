import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { ProductoEntity } from './producto.entity';
@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({ relations: ['tiendas'] });
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['tiendas'],
    });
    if (!producto)
      throw new BusinessLogicException(
        'La producto no se pudo encontrar',
        BusinessError.NOT_FOUND,
      );

    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    if (producto.tipo === 'Perecedero' || producto.tipo === 'No perecedero')
      return await this.productoRepository.save(producto);
    else
      throw new BusinessLogicException(
        'Solo se acepta tipos Perecedero y No perecedero',
        BusinessError.PRECONDITION_FAILED,
      );
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const persistedproducto: ProductoEntity = await this.productoRepository.findOne({ where: { id } });
    if (!persistedproducto)
      throw new BusinessLogicException(
        'La producto no se pudo encontrar',
        BusinessError.NOT_FOUND,
      );

    return await this.productoRepository.save({
      ...persistedproducto,
      ...producto,
    });
  }

  async delete(id: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The producto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }
}
