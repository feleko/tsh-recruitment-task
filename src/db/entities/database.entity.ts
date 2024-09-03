import { Movies } from '../../movies/entities';
import { Genres } from '../../genres/entities';

export type Database = {
  genres: Genres;
  movies: Movies;
}