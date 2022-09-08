import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { DateController } from './date.controller';
import { DateService } from './date.service';

@Module({
  imports: [],
  controllers: [DateController, MatchController],
  providers: [DateService, MatchService],
})
export class AppModule {}
