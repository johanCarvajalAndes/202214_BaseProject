import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsNumber()
  @IsNotEmpty()
  readonly precio: string;

  @IsString()
  @IsNotEmpty()
  readonly tipo: string;
}
