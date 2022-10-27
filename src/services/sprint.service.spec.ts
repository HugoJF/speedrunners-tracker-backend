import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { fakeMatch } from '../factories/match.factory';
import { fakeSprint } from '../factories/sprint.factory';
import { MatchService } from './match.service';
import { SprintService } from './sprint.service';

describe('Date Repository (unit)', () => {
  let matchService: MatchService;
  let sprintService: SprintService;

  let match1;
  let match2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    sprintService = module.get<SprintService>(SprintService);
  });

  it('first match scores 0.5', async () => {
    const sprint = await sprintService.create(fakeSprint());
    await matchService.create(
      fakeMatch({
        p1_score: 3,
        p2_score: 1,
        sprint_id: sprint.id,
      }),
    );

    const result = await sprintService.refreshScore(sprint.id);
    expect(result).toStrictEqual(
      expect.objectContaining({
        id: sprint.id,
        p1_score: 0.5,
        p2_score: 0,
      }),
    );
  });
});
