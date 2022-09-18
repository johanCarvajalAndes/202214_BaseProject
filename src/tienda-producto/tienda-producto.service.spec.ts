import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoEntity } from 'src/producto/producto.entity';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { Repository } from 'typeorm';
import { TiendaProductoService } from './tienda-producto.service';
import { faker } from '@faker-js/faker';

describe('TiendaProductoService', () => {
  let service: TiendaProductoService;
  let tiendaRepository: Repository<TiendaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let productoGlobal: ProductoEntity;
  let tiendaGlobal: TiendaEntity;
  let productoList: ProductoEntity[];
  let tiendaList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaProductoService],
    }).compile();

    service = module.get<TiendaProductoService>(TiendaProductoService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });
  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    tiendaList = [];
    productoList = [];
    for (let i = 0; i < 3; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.company.name(),
        precio: faker.finance.amount(),
        tipo: 'Perecedero',
        tiendas: [],
      });
      productoList.push(producto);
    }
    for (let i = 0; i < 3; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: faker.company.name(),
        ciudad: 'CLO',
        direccion: faker.address.secondaryAddress(),
      });
      tiendaList.push(tienda);
    }
  };
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('addStoreToProduct Asociar una tienda a un producto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.finance.amount(),
      tipo: 'Perecedero',
      tiendas: [],
    });

    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'CLO',
      direccion: faker.address.secondaryAddress(),
    });

    const result: TiendaEntity = await service.addStoreToProduct(
      newTienda.id,
      newProducto.id,
    );
    expect(result.productos.length).toBe(1);
    expect(result.productos[0].id).toBe(newProducto.id);
  });
  it('findStoreFromProduct una tienda por producto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.finance.amount(),
      tipo: 'Perecedero',
      tiendas: [],
    });

    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'CLO',
      direccion: faker.address.secondaryAddress(),
    });

    const newTienda2: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'CLO',
      direccion: faker.address.secondaryAddress(),
    });

    await service.addStoreToProduct(newTienda.id, newProducto.id);
    await service.addStoreToProduct(newTienda2.id, newProducto.id);

    const storedProducto: TiendaEntity = await service.findStoreFromProduct(
      newProducto.id,
    );
    expect(storedProducto).not.toBeNull();
  });
  it('findStoresFromProduct tiendas por producto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.finance.amount(),
      tipo: 'Perecedero',
      tiendas: [],
    });

    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'CLO',
      direccion: faker.address.secondaryAddress(),
    });

    const newTienda2: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'CLO',
      direccion: faker.address.secondaryAddress(),
    });

    const result: TiendaEntity = await service.addStoreToProduct(
      newTienda.id,
      newProducto.id,
    );
    const result2: TiendaEntity = await service.addStoreToProduct(
      newTienda2.id,
      newProducto.id,
    );

    const storedProducto: TiendaEntity[] = await service.findStoresFromProduct(
      newProducto.id,
    );
    expect(storedProducto.length).toBe(2);
    expect(storedProducto[0].id).toBe(result.id || result2.id);
    expect(storedProducto[1].id).toBe(result.id || result2.id);
  });
  it('deleteStoreFromProduct(productoId: string, tiendaId: string) borrar tiendas por producto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.finance.amount(),
      tipo: 'Perecedero',
      tiendas: [],
    });

    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'CLO',
      direccion: faker.address.secondaryAddress(),
    });

    await service.addStoreToProduct(newTienda.id, newProducto.id);

    await service.deleteStoreFromProduct(newProducto.id, newTienda.id);

    const productoFinal: ProductoEntity = await productoRepository.findOne({
      where: { id: newProducto.id },
      relation: ['tiendas'],
    });
    expect(productoFinal.tiendas).toBeNull();
  });
  it('updateStoresFromProduct(productoId: string, newProductoId: string) actualizar tiendas por producto', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.finance.amount(),
      tipo: 'Perecedero',
      tiendas: [],
    });
    const newProducto2: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.finance.amount(),
      tipo: 'Perecedero',
      tiendas: [],
    });

    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: 'CLO',
      direccion: faker.address.secondaryAddress(),
    });

    await service.addStoreToProduct(newTienda.id, newProducto.id);

    await service.updateStoresFromProduct(newProducto.id, newProducto2.id);

    const productoFinal: ProductoEntity = await productoRepository.findOne({
      where: { id: newProducto2.id },
      relation: ['tiendas'],
    });
    expect(productoFinal.tiendas.length).toBe(1);
    expect(productoFinal.tiendas[0].id).toBe(newTienda.id);
  });
});
