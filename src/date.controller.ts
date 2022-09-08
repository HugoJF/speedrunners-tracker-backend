import { Controller, Get, Param } from '@nestjs/common';
import { DateService } from './date.service';

@Controller('dates')
export class DateController {
  constructor(private readonly dateService: DateService) {}

  @Get()
  async getAllDates() {
    return {
      dates: await this.dateService.getAll(),
    };
  }

  @Get(':date')
  async getDate(@Param('date') date) {
    return {
      dates: await this.dateService.get(date),
    };
  }
}
