import { Test, TestingModule } from '@nestjs/testing';

import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { FilterMoviesDto } from './dto/filter-movies.dto';
import { Movie, Movies } from './entities';
import { MoviesController } from './movie.controller';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            getAllMovies: jest.fn(),
            createMovie: jest.fn(),
            filterMovies: jest.fn(),
            getRandomMovie: jest.fn(),
            filterMoviesByDuration: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('should return a random movie if no filters are provided', async () => {
      const mockMovie: Movies = [
        {
          id: 1,
          title: 'Random Movie',
          genres: ['Action'],
          runtime: 120,
          year: 2021,
          director: 'Test Director',
        },
      ];
      jest.spyOn(moviesService, 'getRandomMovie').mockResolvedValue(mockMovie);

      const result = await controller.getMovies({} as FilterMoviesDto);

      expect(moviesService.getRandomMovie).toHaveBeenCalled();
      expect(result).toEqual(mockMovie);
    });
    it('should return a random movie base on duration ', async () => {
      const mockMovies: Movies = [
        {
          id: 1,
          title: 'Random Movie',
          genres: ['Action'],
          runtime: 120,
          year: 2021,
          director: 'Test Director',
        },
        {
          id: 2,
          title: 'Random Movie 2',
          genres: ['Drama'],
          runtime: 10,
          year: 1990,
          director: 'Test Director',
        },
      ];

      jest
        .spyOn(moviesService, 'filterMoviesByDuration')
        .mockResolvedValue([mockMovies[0]]);

      const result = await controller.getMovies({
        duration: 120,
      } as FilterMoviesDto);

      result.forEach((movie, index) => {
        expect(movie.title).toEqual(mockMovies[index].title);
        expect(movie.runtime).toEqual(mockMovies[index].runtime);
        expect(movie.genres).toEqual(mockMovies[index].genres);
        expect(movie.director).toEqual(mockMovies[index].director);
        expect(movie.year).toEqual(mockMovies[index].year);
      });
    });
  });
  describe('createMovie', () => {
    it('should create and return a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'New Movie',
        genres: ['Action'],
        runtime: 120,
        year: 2021,
        director: 'Test Director',
      };
      const mockMovie: Movie = { id: 1, ...createMovieDto };
      jest.spyOn(moviesService, 'createMovie').mockResolvedValue(mockMovie);

      const result = await controller.createMovie(createMovieDto);

      expect(moviesService.createMovie).toHaveBeenCalledWith(createMovieDto);
      expect(result).toEqual(mockMovie);
    });
  });
});
