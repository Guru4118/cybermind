import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  create(job: Partial<Job>) {
    const newJob = this.jobRepository.create(job);
    return this.jobRepository.save(newJob);
  }

  findAll() {
    return this.jobRepository.find();
  }

  findOne(id: number) {
    return this.jobRepository.findOneBy({ id });
  }
}
