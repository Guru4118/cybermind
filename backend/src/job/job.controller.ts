import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './job.entity';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  create(@Body() jobData: Partial<Job>) {
    return this.jobService.create(jobData);
  }

  @Get()
  findAll() {
    return this.jobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(+id);
  }
}
