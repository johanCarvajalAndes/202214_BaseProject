import { Test, TestingModule } from '@nestjs/testing';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendaList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    await seedDatabase();
  });
  const seedDatabase = async () => {
    repository.clear();
    tiendaList = [];
    for (let i = 0; i < 3; i++) {
      const tienda: TiendaEntity = await repository.save({
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
  it('create retorna una nueva tienda', async () => {
    const tienda: TiendaEntity = {
      id: '',
      nombre: faker.company.name(),
      ciudad: 'CLO',
      direccion: faker.address.secondaryAddress(),
      productos: [],
    };

    const newProducto: TiendaEntity = await service.create(tienda);
    expect(newProducto).not.toBeNull();

    const storedProducto: TiendaEntity = await repository.findOne({
      where: { id: newProducto.id },
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre);
    expect(storedProducto.ciudad).toEqual(newProducto.ciudad);
    expect(storedProducto.direccion).toEqual(newProducto.direccion);
  });
  it('findOne retorna una tienda por id', async () => {
    const storedProducto: TiendaEntity = tiendaList[0];
    const tienda: TiendaEntity = await service.findOne(storedProducto.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedProducto.nombre);
    expect(tienda.ciudad).toEqual(storedProducto.ciudad);
    expect(tienda.direccion).toEqual(storedProducto.direccion);
  });

  it('findOne valida una exception para un tienda que no existe', async () => {
    await expect(() => service.findOne('110')).rejects.toHaveProperty(
      'message',
      'No se encontro un tienda con ese id',
    );
  });

  it('update deberia actualziar un tienda', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    tienda.nombre = 'New nombre';
    tienda.ciudad = 'LMO';

    const updatedProducto: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedProducto).not.toBeNull();

    const storedProducto: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(tienda.nombre);
    expect(storedProducto.ciudad).toEqual(tienda.ciudad);
  });

  it('update debera dar exception para un tienda invalido', async () => {
    let tienda: TiendaEntity = tiendaList[0];
    tienda = {
      ...tienda,
      nombre: 'New nombre',
      ciudad: 'TDO lll',
    };
    await expect(() => service.update('0', tienda)).rejects.toHaveProperty(
      'message',
      'No se encontro un tienda con ese id',
    );
  });

  it('delete debera eliminar un tienda', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    await service.delete(tienda.id);

    const deletedProducto: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(deletedProducto).toBeNull();
  });

  it('delete debera dar exception para un tienda invalido', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    await service.delete(tienda.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'No se encontro un tienda con ese id',
    );
  });
});
