import { Injectable } from '@nestjs/common';
import { Genres } from './entities';
import { DbService } from '../db/db.service';

@Injectable()
export class GenresService {
  constructor(private readonly db: DbService) {}

  async getAllGenres(): Promise<Genres> {
    const { genres } = await this.db.loadDatabase();
    return genres;
  }
}
