import { IsString } from 'class-validator';

export class UpdateGatitoDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;
}
