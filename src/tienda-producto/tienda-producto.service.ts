import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from 'src/producto/producto.entity';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TiendaProductoService {

    @InjectRepository(TiendaEntity)
       private readonly tiendaRepository: Repository<MuseumEntity>,
   
       @InjectRepository(ProductoEntity)
       private readonly productoRepository: Repository<ArtworkEntity>
}
