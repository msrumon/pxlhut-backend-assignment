import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class ItemDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsInt()
  @IsNumber()
  readonly price: number;

  @IsInt()
  @IsNumber()
  readonly quantity: number;
}

export class PaymentDto {
  @Type(() => ItemDto)
  @ValidateNested()
  readonly items: Array<ItemDto>;
}
