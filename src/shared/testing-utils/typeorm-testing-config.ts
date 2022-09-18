/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductoEntity } from '../../producto/producto.entity';
import { PaisEntity } from '../../pais/pais.entity';
import { CiudadEntity } from '../../ciudad/ciudad.entity';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { CulturagastronomicaEntity } from '../../culturagastronomica/culturagastronomica.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ProductoEntity, PaisEntity, CiudadEntity, RestauranteEntity, RecetaEntity, CulturagastronomicaEntity],
    synchronize: true,
    keepConnectionAlive: true
  }),
  TypeOrmModule.forFeature([ProductoEntity, PaisEntity, CiudadEntity, RestauranteEntity, RecetaEntity, CulturagastronomicaEntity]),
];