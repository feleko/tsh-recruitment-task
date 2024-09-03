import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Movie, Movies } from './entities';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterMoviesDto } from './dto/filter-movies.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {
  }

  @HttpCode(200)
  @Post('/filter')
  async getMovies(@Body() filterMoviesDto: FilterMoviesDto): Promise<Movies> {
    const { duration, genres } = filterMoviesDto;
    if (duration && genres && genres.length > 0 || genres && genres.length > 0) {
      return await this.movieService.filterMovies(filterMoviesDto);
    } else if (duration && !genres) {
      return await this.movieService.filterMoviesByDuration(duration);
    } else {
      return await this.movieService.getRandomMovie();
    }
  }

  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.movieService.createMovie(createMovieDto);
  }
}
