import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { SprintSetCurrentDto } from '../dto/sprint-set-current.dto';

export class SprintSetCurrentRequest {
  @ValidateNested()
  @Type(() => SprintSetCurrentDto)
  sprint: SprintSetCurrentDto;
}
