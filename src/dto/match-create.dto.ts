import { maps, Maps } from '../types';
import { IsDateString, IsIn, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Match {
  @IsIn(Object.keys(maps))
  map: Maps;

  @Min(0)
  @Max(3)
  denerd_score: number;

  @Min(0)
  @Max(3)
  chase_score: number;

  @IsDateString()
  created_at?: string;
}

export class MatchCreateDto {
  @ValidateNested()
  @Type(() => Match)
  match: Match;
}
