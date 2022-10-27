import { IsIn, IsNotEmpty, Max, Min } from 'class-validator';
import { Maps, maps } from '../types';

export class MatchUpdateDto {
  @IsIn(Object.keys(maps))
  @IsNotEmpty()
  map: Maps;

  @Min(0)
  @Max(3)
  p1_score: number;

  @Min(0)
  @Max(3)
  p2_score: number;
}
