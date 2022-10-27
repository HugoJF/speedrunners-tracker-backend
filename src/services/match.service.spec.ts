import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { MatchCreateDto } from '../dto/match-create.dto';
import { fakeMatch } from '../factories/match.factory';
import { fakeSprint } from '../factories/sprint.factory';
import { Maps } from '../types';
import { MatchService } from './match.service';
import { SprintService } from './sprint.service';

describe('Match Repository (unit)', () => {
  let matchService: MatchService;
  let sprintService: SprintService;

  let sprint1;
  let sprint2;

  const map1: Maps = 'festival';
  const map2: Maps = 'cassino';

  let sprint1match1: MatchCreateDto;
  let sprint1match2: MatchCreateDto;
  let sprint2match1: MatchCreateDto;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    sprintService = module.get<SprintService>(SprintService);

    sprint1 = await sprintService.create(fakeSprint());
    sprint2 = await sprintService.create(fakeSprint());

    sprint1match1 = fakeMatch({
      sprint_id: sprint1.id,
      map: map1,
    });
    sprint1match2 = fakeMatch({
      sprint_id: sprint1.id,
      map: map2,
    });
    sprint2match1 = fakeMatch({
      sprint_id: sprint2.id,
      map: map1,
    });
  });

  it('getAll returns empty array when no matches exist', async () => {
    const result = await matchService.all();

    expect(result).toStrictEqual([]);
  });

  it('getById returns null when no match exist', async () => {
    const result = await matchService.getById('a-random-id');

    expect(result).toStrictEqual(null);
  });

  it('creates match 1', async () => {
    const result = await matchService.create(sprint1match1);

    expect(result).toStrictEqual(expect.objectContaining(sprint1match1));
  });

  it('creates match 2', async () => {
    const result = await matchService.create(sprint1match2);

    expect(result).toStrictEqual(expect.objectContaining(sprint1match2));
  });

  it('creates match 3', async () => {
    const result = await matchService.create(sprint2match1);

    expect(result).toStrictEqual(expect.objectContaining(sprint2match1));
  });

  it('getByMap works', async () => {
    const result = await matchService.getByMap(map1);

    expect(result).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining(sprint1match1),
        expect.objectContaining(sprint2match1),
      ]),
    );
  });
});
