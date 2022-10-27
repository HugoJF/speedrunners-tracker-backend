import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ToInstance } from '../decorators/to-instance';
import { Wrap } from '../decorators/wrap';
import { Sprint } from '../entities/sprint.entity';
import { SprintCreateRequest } from '../requests/sprint-create.request';
import { SprintSetCurrentRequest } from '../requests/sprint-set-current.request';
import { SprintUpdateRequest } from '../requests/sprint-update.request';
import { SprintService } from '../services/sprint.service';

@Controller('sprints')
export class SprintController {
  constructor(private readonly sprintService: SprintService) {}

  @Get('current')
  @Wrap('current')
  async getCurrentSprint() {
    return await this.sprintService.getCurrent();
  }

  @Post('current')
  @Wrap('current')
  async setCurrentSprint(@Body() data: SprintSetCurrentRequest) {
    return await this.sprintService.setCurrent(data.sprint.id);
  }

  @Get()
  @Wrap('sprints')
  async getAllSprints() {
    return await this.sprintService.all();
  }

  @Get(':date')
  @Wrap('sprints')
  async getSprint(@Param('date') date) {
    return await this.sprintService.getById(date);
  }

  @Post()
  @Wrap('sprints')
  @ToInstance(Sprint)
  async createSprint(@Body() data: SprintCreateRequest) {
    return await this.sprintService.create(data.sprint);
  }

  @Put(':id')
  @Wrap('sprints')
  @ToInstance(Sprint)
  async updateSprint(
    @Param('id') id: string,
    @Body() data: SprintUpdateRequest,
  ) {
    return await this.sprintService.update(id, data.sprint);
  }
}
