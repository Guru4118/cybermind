import { DataSource } from 'typeorm';
import { Job } from './src/job/job.entity';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_pg_username',
  password: 'your_pg_password',
  database: 'jobs_db',
  entities: [Job],
  synchronize: true, // only for dev!
});
