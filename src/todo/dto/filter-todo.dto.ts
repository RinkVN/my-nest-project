import { IsBoolean, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterTodoDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  completed?: boolean;

  @IsString()
  @IsOptional()
  title?: string;
}