import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { SprintUpdateDto } from '../dto/sprint-update.dto';

export class SprintUpdateRequest {
  @ValidateNested()
  @Type(() => SprintUpdateDto)
  sprint: SprintUpdateDto;
}
