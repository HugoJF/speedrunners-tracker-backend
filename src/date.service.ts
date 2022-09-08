import { DateRepository } from './date.repository';
import { MatchService } from './match.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  constructor(
    @Inject(forwardRef(() => MatchService))
    private readonly matchService: MatchService,
  ) {}

  async getAll() {
    return DateRepository.query.all({}).go();
  }

  async get(date: string) {
    return DateRepository.get({ date }).go();
  }

  async refreshScore(date: string) {
    const matches = await this.matchService.getByDate(date);
    let denerd = 0;
    let chase = 0;

    for (const match of matches) {
      const first = denerd === 0 && chase === 0;
      const score = first ? 0.5 : 1;

      if (match.denerd_score === 3) {
        denerd += score;
      } else {
        chase += score;
      }
    }

    await DateRepository.update({ date })
      .set({
        denerd_score: denerd,
        chase_score: chase,
      })
      .go();

    return DateRepository.get({ date }).go();
  }

  async deleteIfEmpty(date: string) {
    const matches = await this.matchService.getByDate(date);

    if (matches.length > 0) {
      return;
    }

    await DateRepository.delete({ date }).go();
  }
}
