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
  Query,
} from '@nestjs/common';
import { ToInstance } from '../decorators/to-instance';
import { Wrap } from '../decorators/wrap';
import { Match } from '../entities/match.entity';
import { MatchCreateRequest } from '../requests/match-create.request';
import { MatchUpdateRequest } from '../requests/match-update.request';
import { MatchService } from '../services/match.service';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @Wrap('matches')
  @ToInstance(Match)
  async getAllMatches(@Query('map') map, @Query('sprint') sprint) {
    if (map) {
      return await this.matchService.getByMap(map);
    }

    if (sprint) {
      return await this.matchService.getBySprintId(sprint);
    }

    return await this.matchService.all();
  }

  @Get(':id')
  @ToInstance(Match)
  async getMatchById(@Param('id') id) {
    return await this.matchService.getById(id);
  }

  @Post()
  @Wrap('match')
  @ToInstance(Match)
  async createMatch(@Body() data: MatchCreateRequest) {
    return await this.matchService.create(data.match);
  }

  @Put(':id')
  @ToInstance(Match)
  async updateMatch(@Param('id') id, @Body() data: MatchUpdateRequest) {
    return await this.matchService.update(id, data.match);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id) {
    await this.matchService.deleteById(id);
  }
}
