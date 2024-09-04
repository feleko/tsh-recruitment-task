import { Module } from '@nestjs/common';
import { MoviesController } from './movie.controller';
import { MoviesService } from './movies.service';
import { DbService } from '../db/db.service';
import { GenresService } from '../genres/genres.service';

import { JoiPipeModule } from 'nestjs-joi';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, DbService, GenresService],
  exports: [GenresService],
  imports: [JoiPipeModule],
})
export class MoviesModule {}
