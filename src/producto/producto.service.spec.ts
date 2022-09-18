import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productoList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    productoList = [];
    for (let i = 0; i < 3; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.company.name(),
        precio: faker.finance.amount(),
        tipo: 'Perecedero',
        tiendas: [],
      });
      productoList.push(producto);
    }
  };
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('create retorna una nueva producto', async () => {
    const producto: ProductoEntity = {
      id: '',
      nombre: faker.company.name(),
      precio: 1000,
      tipo: 'Perecedero',
      tiendas: [],
    };

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: newProducto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre);
    expect(storedProducto.precio).toEqual(newProducto.precio);
    expect(storedProducto.tipo).toEqual(newProducto.tipo);
  });
  it('findOne retorna una producto por id', async () => {
    const storedProducto: ProductoEntity = productoList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
    expect(producto.precio).toEqual(storedProducto.precio);
    expect(producto.tipo).toEqual(storedProducto.tipo);
  });

  it('findOne valida una exception para un producto que no existe', async () => {
    await expect(() => service.findOne('110')).rejects.toHaveProperty(
      'message',
      'No se encontro un producto con ese id',
    );
  });

  it('update deberia actualziar un producto', async () => {
    const producto: ProductoEntity = productoList[0];
    producto.nombre = 'New nombre';
    producto.precio = 2000;

    const updatedProducto: ProductoEntity = await service.update(
      producto.id,
      producto,
    );
    expect(updatedProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre);
    expect(storedProducto.precio).toEqual(producto.precio);
  });

  it('update debera dar exception para un producto invalido', async () => {
    let producto: ProductoEntity = productoList[0];
    producto = {
      ...producto,
      nombre: 'New nombre',
      precio: 2000,
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty(
      'message',
      'No se encontro un producto con ese id',
    );
  });

  it('delete debera eliminar un producto', async () => {
    const producto: ProductoEntity = productoList[0];
    await service.delete(producto.id);

    const deletedProducto: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(deletedProducto).toBeNull();
  });

  it('delete debera dar exception para un producto invalido', async () => {
    const producto: ProductoEntity = productoList[0];
    await service.delete(producto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'No se encontro un producto con ese id',
    );
  });
});
