import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column({ default: '' })
  logo: string;

  @Column()
  location: string;

  @Column()
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

  @Column({ default: '0 years' })
  experience: string;

  @Column()
  salaryMin: number;

  @Column()
  salaryMax: number;

  @Column('float', { nullable: true })
  minMonth: number;

  @Column('float', { nullable: true })
  maxMonth: number;

  @Column('text')
  description: string;

  @Column('text', { default: 'N/A' })
  requirements: string;

  @Column('text', { default: 'N/A' })
  responsibilities: string;

  @Column({ type: 'date' })
  applicationDeadline: Date;

  @CreateDateColumn()
  postedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateMinMonth() {
    this.minMonth = this.salaryMin / 12;
  }
  @BeforeInsert()
  @BeforeUpdate()
  calculateMaxMonth() {
    this.maxMonth = this.salaryMax / 12;
  }
}
