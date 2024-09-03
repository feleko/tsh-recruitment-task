import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie, Movies } from './entities';
import { DbService } from '../db/db.service';
import { GenresService } from '../genres/genres.service';
import { InvalidGenresException } from './exception/invalid-genres.exception';
import { DuplicateGenresException } from './exception/duplicate-genres.exception';
import { NoMoviesFoundException } from './exception/no-movies-found.exception';
import { Genre } from '../genres/entities';
import { FilterMoviesDto } from './dto/filter-movies.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly db: DbService, private readonly genresService: GenresService) {
  }

  async getAllMovies(): Promise<Movies> {
    const { movies } = await this.db.loadDatabase();
    return movies;
  }

  async createMovie(createMovieDto: CreateMovieDto): Promise<Movie> {
    const validGenres = await this.genresService.getAllGenres();
    const invalidGenres = createMovieDto.genres.filter(genre => !validGenres.includes(genre));

    if (invalidGenres.length > 0) {
      throw new InvalidGenresException(invalidGenres);
    }

    const uniqueGenres = new Set(createMovieDto.genres);
    if (uniqueGenres.size !== createMovieDto.genres.length) {
      throw new DuplicateGenresException();
    }

    const database = await this.db.loadDatabase();
    const newMovie: Movie = {
      id: database.movies.length ? database.movies[database.movies.length - 1].id + 1 : 1,
      ...createMovieDto,
    };
    database.movies.push(newMovie);
    await this.db.saveDatabase(database);
    return newMovie;
  }

  async filterMoviesByDuration(duration: number): Promise<Movies> {
    const movies = await this.getAllMovies();

    const filteredMovies = movies.filter(
      (movie: Movie) => movie.runtime >= (duration - 10) && movie.runtime <= (duration + 10),
    );

    if (filteredMovies.length === 0) {
      throw new NoMoviesFoundException();
    }

    const randomIndex = Math.floor(Math.random() * filteredMovies.length);
    return [filteredMovies[randomIndex]];
  }

  async filterMovies(filterMoviesDto: FilterMoviesDto): Promise<Movies> {
    const { duration, genres } = filterMoviesDto;
    let movies = await this.getAllMovies();

    if (duration) {
      movies = movies.filter(
        (movie: Movie) => movie.runtime >= (duration - 10) && movie.runtime <= (duration + 10),
      );
    }

    if (genres && genres.length > 0) {
      const lowerCaseGenres = genres.map(genre => genre.toLowerCase());

      const groupedMovies: { [key: number]: Movies } = {};

      movies.forEach((movie) => {
        const matchCount = movie.genres.filter((g: Genre) => lowerCaseGenres.includes(g.toLowerCase())).length;

        if (matchCount > 0) {
          if (!groupedMovies[matchCount]) {
            groupedMovies[matchCount] = [];
          }
          groupedMovies[matchCount].push(movie);
        }
      });

      movies = Object.keys(groupedMovies)
        .map(Number)
        .sort((a, b) => b - a)
        .reduce((acc, key) => {
          return [...acc, ...groupedMovies[key]];
        }, []);
    }

    if (movies.length === 0) {
      throw new NoMoviesFoundException();
    }

    return movies;
  }

  async getRandomMovie(): Promise<Movies> {
    const movies = await this.getAllMovies();
    if (movies.length === 0) {
      throw new NoMoviesFoundException();
    }
    const randomIndex = Math.floor(Math.random() * movies.length);
    return [movies[randomIndex]];
  }
}
