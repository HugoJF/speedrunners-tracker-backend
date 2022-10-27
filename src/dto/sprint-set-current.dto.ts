import { IsString, Min } from 'class-validator';

export class SprintSetCurrentDto {
  @IsString()
  id: string;
}
