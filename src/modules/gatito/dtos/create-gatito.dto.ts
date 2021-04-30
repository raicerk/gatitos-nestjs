import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGatitoDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNotEmpty()
  readonly authors: number[];
}
