import { MatchCreateDto } from './dto/match-create.dto';
import { MatchRepository } from './match.repository';
import { Maps } from './types';
import { splitDatetime } from './utils';
import { MatchGetDto } from './dto/match-get.dto';
import { MatchUpdateDto } from './dto/match-update.dto';
import { DateRepository } from './date.repository';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DateService } from './date.service';

@Injectable()
export class MatchService {
  constructor(
    @Inject(forwardRef(() => DateService))
    private readonly dateService: DateService,
  ) {}

  async create({ match }: MatchCreateDto) {
    const now = new Date().toISOString();
    const created_at = match.created_at;
    const defaults = splitDatetime(created_at ?? now);

    await DateRepository.put({
      date: defaults.date,
    }).go();

    const result = await MatchRepository.create({
      ...defaults,
      ...match,
    }).go();

    await this.dateService.refreshScore(result.date);

    return result;
  }

  getAll() {
    return MatchRepository.query.all({}).go({
      params: { ScanIndexForward: false },
    });
  }

  getById(data: MatchGetDto) {
    return MatchRepository.get(data).go();
  }

  getByDatetime(datetime: string) {
    return this.getById(splitDatetime(datetime));
  }

  getByDate(date: string) {
    return MatchRepository.query.byDate({ date }).go();
  }

  getByMap(map: Maps) {
    return MatchRepository.query.byMap({ map }).go();
  }

  async update(id: string, data: MatchUpdateDto) {
    const result = await MatchRepository.update(splitDatetime(id))
      .set(data.match)
      .go({ response: 'all_new' });

    await this.dateService.refreshScore(result.date);

    return result;
  }

  deleteByDatetime(datetime: string) {
    return this.deleteById(splitDatetime(datetime));
  }

  async deleteById(data: { date: string; time: string }) {
    const result = await MatchRepository.delete(data).go();

    await this.dateService.refreshScore(data.date);

    return result;
  }
}
