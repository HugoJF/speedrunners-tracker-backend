import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { SprintCreateDto } from '../dto/sprint-create.dto';

export class SprintCreateRequest {
  @ValidateNested()
  @Type(() => SprintCreateDto)
  sprint: SprintCreateDto;
}
