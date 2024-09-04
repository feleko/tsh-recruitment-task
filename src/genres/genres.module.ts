import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { DbService } from '../db/db.service';

@Module({
  providers: [GenresService, DbService],
})
export class GenresModule {}
