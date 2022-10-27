import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Unwrap } from '../decorators/unwrap';
import { MatchCreateDto } from '../dto/match-create.dto';
import { MatchUpdateDto } from '../dto/match-update.dto';
import { MatchRepository } from '../repositories/match.repository';
import { Maps } from '../types';
import { SprintService } from './sprint.service';

@Injectable()
export class MatchService {
  constructor(
    @Inject(forwardRef(() => SprintService))
    private readonly sprintService: SprintService,
  ) {}

  @Unwrap('data')
  async all() {
    return await MatchRepository.query.all({}).go({
      order: 'desc',
    });
  }

  async getById(id: string) {
    const result = await MatchRepository.query.all({ id }).go({ limit: 1 });

    if (result.data.length === 0) {
      return null;
    }

    return result.data[0];
  }

  @Unwrap('data')
  async getBySprintId(sprint_id: string) {
    return await MatchRepository.query.bySprintId({ sprint_id }).go();
  }

  @Unwrap('data')
  async getByMap(map: Maps) {
    return await MatchRepository.query.byMap({ map }).go();
  }

  @Unwrap('data')
  async create(dto: MatchCreateDto) {
    // TODO: move sprint validation outside service
    const sprint = await this.sprintService.getById(dto.sprint_id);

    if (!sprint) {
      throw new BadRequestException(`Sprint ${dto.sprint_id} does not exist`);
    }

    const response = await MatchRepository.create(dto).go();

    await this.sprintService.refreshScore(dto.sprint_id);

    return response;
  }

  @Unwrap('data')
  async update(id: string, data: MatchUpdateDto) {
    const { sprint_id } = await this.getById(id);
    const response = await MatchRepository.update({ id, sprint_id })
      .set(data)
      .go({ response: 'all_new' });

    await this.sprintService.refreshScore(response.data.sprint_id);

    return response;
  }

  async deleteById(id: string): Promise<void> {
    const { sprint_id } = await this.getById(id);

    await MatchRepository.delete({ id, sprint_id }).go();
    await this.sprintService.refreshScore(sprint_id);
  }
}
