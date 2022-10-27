import { IsString, Min } from 'class-validator';
import { Maps } from '../types';

export class SprintUpdateDto {
  @IsString()
  name: Maps;

  @Min(0)
  goal: number;
}
