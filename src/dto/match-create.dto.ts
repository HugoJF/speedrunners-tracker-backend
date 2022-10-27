import { IsIn, IsString, Max, Min } from 'class-validator';
import { Maps, maps } from '../types';

export class MatchCreateDto {
  @IsString()
  sprint_id: string;

  @IsIn(Object.keys(maps))
  map: Maps;

  @Min(0)
  @Max(3)
  p1_score: number;

  @Min(0)
  @Max(3)
  p2_score: number;
}
