import { MatchService } from './match.service';
import { MatchCreateDto } from './dto/match-create.dto';
import { DateService } from './date.service';
import { AppModule } from './app.module';
import { Test, TestingModule } from '@nestjs/testing';

describe('Date Repository (unit)', () => {
  let matchService: MatchService;
  let dateService: DateService;

  const date = '2022-10-10';

  const match1: MatchCreateDto = {
    match: {
      denerd_score: 3,
      chase_score: 0,
      map: 'festival',
      created_at: `${date}T11:00Z`,
    },
  };

  const match2: MatchCreateDto = {
    match: {
      denerd_score: 3,
      chase_score: 0,
      map: 'festival',
      created_at: `${date}T11:00Z`,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    dateService = module.get<DateService>(DateService);
  });

  it('first match scores 0.5', async () => {
    await matchService.create(match1);
    const result = await dateService.refreshScore(date);

    expect(result).toEqual({
      date: date,
      denerd_score: 0.5,
      chase_score: 0,
    });
  });
});
