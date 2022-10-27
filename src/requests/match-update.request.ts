import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { MatchUpdateDto } from '../dto/match-update.dto';

export class MatchUpdateRequest {
  @ValidateNested()
  @Type(() => MatchUpdateDto)
  match: MatchUpdateDto;
}
