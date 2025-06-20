import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobModule } from './job/job.module';
import { Job } from './job/job.entity'; // Verify path: Job is relative to app.module.ts
import * as dotenv from 'dotenv'; // <--- IMPORTANT: Add this if not in main.ts
                                  //      or ensure dotenv.config() is called somewhere globally

// Make sure dotenv.config() is called before TypeOrmModule.forRoot()
// If it's already in main.ts, you don't need it here.
// But if you're experiencing issues, adding it here can ensure env vars are loaded.
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // <--- Use the DATABASE_URL environment variable
      ssl: {
        rejectUnauthorized: false, // <--- Crucial for Render's SSL
      },
      entities: [Job], // This is correct if Job is your only root entity.
                        // Or use autoLoadEntities: true if you prefer.
      synchronize: true, // !!! WARNING: Keep this TRUE ONLY FOR DEVELOPMENT/INITIAL SETUP.
                          // Turn OFF (false) for production and use migrations.
    }),
    JobModule,
  ],
})
export class AppModule {}