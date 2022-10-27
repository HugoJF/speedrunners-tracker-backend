import { Module } from '@nestjs/common';
import { MatchController } from './controllers/match.controller';
import { SprintController } from './controllers/sprint.controller';
import { MatchService } from './services/match.service';
import { SprintService } from './services/sprint.service';

@Module({
  imports: [],
  controllers: [SprintController, MatchController],
  providers: [SprintService, MatchService],
})
export class AppModule {}
