import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChangepasswordDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  password: string;
}
