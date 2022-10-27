import { IsString, Min } from 'class-validator';

export class SprintCreateDto {
  @IsString()
  name: string;

  @IsString()
  p1_name: string;

  @IsString()
  p2_name: string;

  @Min(1)
  goal: number;
}
