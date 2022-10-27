import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { MatchCreateDto } from '../dto/match-create.dto';

export class MatchCreateRequest {
  @ValidateNested()
  @Type(() => MatchCreateDto)
  match: MatchCreateDto;
}
