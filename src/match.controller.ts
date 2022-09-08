import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchCreateDto } from './dto/match-create.dto';
import { plainToInstance } from 'class-transformer';
import { Match } from './entities/match.entity';
import { MatchUpdateDto } from './dto/match-update.dto';
import { splitDatetime } from './utils';
import { DateService } from './date.service';

@Controller('matches')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly dateService: DateService,
  ) {}

  @Get()
  async getAllMatches() {
    return {
      matches: plainToInstance(Match, await this.matchService.getAll()),
    };
  }

  @Get('by-date/:date')
  async getMatchesByDay(@Param('date') date) {
    return {
      matches: plainToInstance(Match, await this.matchService.getByDate(date)),
    };
  }

  @Get('by-map/:map')
  async getMatchesByMap(@Param('map') map) {
    return {
      matches: plainToInstance(Match, await this.matchService.getByMap(map)),
    };
  }

  @Get(':id')
  async getMatchById(@Param('id') id) {
    return plainToInstance(Match, await this.matchService.getByDatetime(id));
  }

  @Post()
  async createMatch(@Body() data: MatchCreateDto) {
    const match = plainToInstance(Match, await this.matchService.create(data));
    return { match };
  }

  @Put(':id')
  async updateMatch(@Param('id') id, @Body() data: MatchUpdateDto) {
    return plainToInstance(Match, await this.matchService.update(id, data));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id) {
    const { date } = splitDatetime(id);

    await this.matchService.deleteByDatetime(id);
    await this.dateService.deleteIfEmpty(date);
  }
}
