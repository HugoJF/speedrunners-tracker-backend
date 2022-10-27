import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Unwrap } from '../decorators/unwrap';
import { SprintCreateDto } from '../dto/sprint-create.dto';
import { SprintUpdateDto } from '../dto/sprint-update.dto';
import { SprintRepository } from '../repositories/sprint.repository';
import { MatchService } from './match.service';

@Injectable()
export class SprintService {
  constructor(
    @Inject(forwardRef(() => MatchService))
    private readonly matchService: MatchService,
  ) {}

  @Unwrap('data')
  async all() {
    return await SprintRepository.query.all({}).go({
      order: 'desc',
    });
  }

  async setCurrent(id: string) {
    return await SprintRepository.update({ id })
      .set({
        touched_at: new Date().toISOString(),
      })
      .go({
        response: 'all_new',
      });
  }

  async getCurrent() {
    const result = await SprintRepository.query.current({}).go({
      limit: 1,
      order: 'desc',
    });

    if (result.data.length === 0) {
      return null;
    }

    return result.data[0];
  }

  @Unwrap('data')
  async getById(id: string) {
    return await SprintRepository.get({ id }).go();
  }

  @Unwrap('data')
  async create(dto: SprintCreateDto) {
    // @ts-ignore
    return await SprintRepository.create(dto).go();
  }

  @Unwrap('data')
  async update(id: string, data: SprintUpdateDto) {
    return await SprintRepository.update({ id }).set(data).go();
  }

  @Unwrap('data')
  async delete(id: string) {
    const matches = await this.matchService.getBySprintId(id);

    // @ts-ignore
    if (matches.length > 0) {
      throw new Error('This sprint contains matches');
    }

    return await SprintRepository.delete({ id }).go();
  }

  @Unwrap('data')
  async refreshScore(id: string) {
    const matches = await this.matchService.getBySprintId(id);
    let p1_score = 0;
    let p2_score = 0;

    // @ts-ignore
    for (const match of matches) {
      const first = p1_score === 0 && p2_score === 0;
      const score = first ? 0.5 : 1;

      if (match.p1_score === 3) {
        p1_score += score;
      } else if (match.p2_score === 3) {
        p2_score += score;
      }
    }

    await SprintRepository.update({ id }).set({ p1_score, p2_score }).go();

    return await SprintRepository.get({ id }).go();
  }
}
