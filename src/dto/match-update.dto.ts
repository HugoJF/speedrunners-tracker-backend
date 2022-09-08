import { IsIn, IsNotEmpty, Max, Min, ValidateNested } from 'class-validator';
import { Maps, maps } from '../types';
import { Type } from 'class-transformer';

class Match {
  @IsIn(Object.keys(maps))
  @IsNotEmpty()
  map: Maps;

  @Min(0)
  @Max(3)
  denerd_score: number;

  @Min(0)
  @Max(3)
  chase_score: number;
}

export class MatchUpdateDto {
  @ValidateNested()
  @Type(() => Match)
  match: Match;
}
