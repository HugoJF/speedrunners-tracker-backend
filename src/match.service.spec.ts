import { MatchService } from './match.service';
import { MatchCreateDto } from './dto/match-create.dto';
import { Maps } from './types';

describe('Match Repository (unit)', () => {
  const service = new MatchService();

  const day1date = '2022-10-10';
  const day2date = '2022-10-11';
  const map1: Maps = 'festival';
  const map2: Maps = 'cassino';

  const day1match1: MatchCreateDto = {
    match: {
      denerd_score: 3,
      chase_score: 0,
      map: map1,
      created_at: `${day1date}T11:00Z`,
    },
  };
  const day1match2: MatchCreateDto = {
    match: {
      denerd_score: 0,
      chase_score: 3,
      map: map2,
      created_at: `${day1date}T12:00Z`,
    },
  };
  const day2match1: MatchCreateDto = {
    match: {
      denerd_score: 3,
      chase_score: 2,
      map: map1,
      created_at: `${day2date}T11:00Z`,
    },
  };

  it('creates match 1', async () => {
    const result = await service.create(day1match1);

    expect(result).toEqual(day1match1.match);
  });

  it('creates match 2', async () => {
    const result = await service.create(day1match2);

    expect(result).toEqual(day1match2.match);
  });

  it('creates match 3', async () => {
    const result = await service.create(day2match1);

    expect(result).toEqual(day2match1.match);
  });

  it('getByDate works', async () => {
    const result = await service.getByDate(day1date);

    expect(result).toEqual(
      expect.arrayContaining([day1match1.match, day1match2.match]),
    );
  });

  it('getByMap works', async () => {
    const result = await service.getByMap(map1);

    expect(result).toEqual(
      expect.arrayContaining([day1match1.match, day2match1.match]),
    );
  });
});
