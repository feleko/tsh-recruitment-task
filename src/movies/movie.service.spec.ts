import { Test, TestingModule } from '@nestjs/testing';

import { DbService } from '../db/db.service';
import { GenresService } from '../genres/genres.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie, Movies } from './entities';
import { InvalidGenresException } from './exception/invalid-genres.exception';
import { DuplicateGenresException } from './exception/duplicate-genres.exception';
import { NoMoviesFoundException } from './exception/no-movies-found.exception';
import { Genres } from '../genres/entities';
import { FilterMoviesDto } from './dto/filter-movies.dto';
import { MoviesService } from './movies.service';

jest.mock('../db/db.service');
jest.mock('../genres/genres.service');

describe('MoviesService', () => {
  let service: MoviesService;
  let dbService: DbService;
  let genresService: GenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: DbService,
          useValue: {
            loadDatabase: jest.fn(),
            saveDatabase: jest.fn(),
          },
        },
        {
          provide: GenresService,
          useValue: {
            getAllGenres: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    dbService = module.get<DbService>(DbService);
    genresService = module.get<GenresService>(GenresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMovie', () => {
    it('should create and save a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Inception',
        year: 2010,
        runtime: 148,
        director: 'Christopher Nolan',
        genres: ['Action', 'Thriller'],
        actors: 'Leonardo DiCaprio',
        plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
        posterUrl: 'http://example.com/inception.jpg',
      };
      const validGenres: Genres = ['Sci-Fi', 'Thriller', 'Action'];
      const mockDatabase = { movies: [], genres: validGenres };
      const newMovie: Movie = {
        ...createMovieDto,
        id: 1,
        genres: ['Action', 'Thriller'],
      };

      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue(mockDatabase);
      jest.spyOn(dbService, 'saveDatabase').mockResolvedValue(undefined);
      jest.spyOn(genresService, 'getAllGenres').mockResolvedValue(validGenres);

      const result = await service.createMovie(createMovieDto);

      expect(dbService.loadDatabase).toHaveBeenCalled();
      expect(dbService.saveDatabase).toHaveBeenCalledWith({ ...mockDatabase, movies: [newMovie] });
      expect(result).toEqual(newMovie);
    });

    it('should throw InvalidGenresException for invalid genres', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Inception',
        year: 2010,
        runtime: 148,
        director: 'Christopher Nolan',
        genres: ['Sci-Fi', 'UnknownGenre'],
        actors: 'Leonardo DiCaprio',
        plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
        posterUrl: 'http://example.com/inception.jpg',
      };
      const validGenres: Genres = ['Sci-Fi', 'Thriller', 'Action'];

      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue({ movies: [], genres: validGenres });
      jest.spyOn(genresService, 'getAllGenres').mockResolvedValue(validGenres);

      await expect(service.createMovie(createMovieDto)).rejects.toThrow(InvalidGenresException);
    });

    it('should throw DuplicateGenresException for duplicate genres', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Inception',
        year: 2010,
        runtime: 148,
        director: 'Christopher Nolan',
        genres: ['Sci-Fi', 'Sci-Fi'],
        actors: 'Leonardo DiCaprio',
        plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
        posterUrl: 'http://example.com/inception.jpg',
      };
      const validGenres: Genres = ['Sci-Fi', 'Thriller', 'Action'];

      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue({ movies: [], genres: validGenres });
      jest.spyOn(genresService, 'getAllGenres').mockResolvedValue(validGenres);

      await expect(service.createMovie(createMovieDto)).rejects.toThrow(DuplicateGenresException);
    });
  });

  describe('filterMoviesByDuration', () => {
    it('should return a random movie within the duration range', async () => {
      const mockMovies: Movies = [
        {
          id: 1,
          title: 'Movie 1',
          year: 2020,
          runtime: 100,
          director: 'Director 1',
          genres: ['Action'],
          actors: 'Actor 1',
          plot: '',
          posterUrl: '',
        },
        {
          id: 2,
          title: 'Movie 2',
          year: 2021,
          runtime: 110,
          director: 'Director 2',
          genres: ['Drama'],
          actors: 'Actor 2',
          plot: '',
          posterUrl: '',
        },
        {
          id: 3,
          title: 'Movie 3',
          year: 2022,
          runtime: 120,
          director: 'Director 3',
          genres: ['Comedy'],
          actors: 'Actor 3',
          plot: '',
          posterUrl: '',
        },
      ];
      const duration = 105;
      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue({ movies: mockMovies, genres: [] });

      const result = await service.filterMoviesByDuration(duration);

      expect(result.length).toBe(1);
      expect(mockMovies.some(movie => movie.runtime >= duration - 10 && movie.runtime <= duration + 10)).toBe(true);
    });

    it('should throw NoMoviesFoundException if no movies match the duration', async () => {
      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue({ movies: [], genres: [] });

      await expect(service.filterMoviesByDuration(105)).rejects.toThrow(NoMoviesFoundException);
    });
  });

  describe('filterMovies', () => {
    it('should return filtered movies by duration and genres', async () => {
      const mockMovies: Movies = [
        {
          id: 1,
          title: 'Movie 1',
          year: 2020,
          runtime: 115,
          director: 'Director 1',
          genres: ['Action'],
          actors: 'Actor 1',
          plot: '',
          posterUrl: '',
        },
        {
          id: 2,
          title: 'Movie 2',
          year: 2021,
          runtime: 110,
          director: 'Director 2',
          genres: ['Drama'],
          actors: 'Actor 2',
          plot: '',
          posterUrl: '',
        },
        {
          id: 3,
          title: 'Movie 3',
          year: 2022,
          runtime: 120,
          director: 'Director 3',
          genres: ['Action', 'Comedy'],
          actors: 'Actor 3',
          plot: '',
          posterUrl: '',
        },
      ];
      const filterDto: FilterMoviesDto = { duration: 115, genres: ['Action'] };
      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue({ movies: mockMovies, genres: [] });

      const result = await service.filterMovies(filterDto);

      expect(result.length).toBe(2);
      expect(result.every(movie => movie.genres.includes('Action'))).toBe(true);
    });

    it('should return all movies within the duration range if no genres are specified', async () => {
      const mockMovies: Movies = [
        {
          id: 1,
          title: 'Movie 1',
          year: 2020,
          runtime: 100,
          director: 'Director 1',
          genres: ['Action'],
          actors: 'Actor 1',
          plot: '',
          posterUrl: '',
        },
        {
          id: 2,
          title: 'Movie 2',
          year: 2021,
          runtime: 110,
          director: 'Director 2',
          genres: ['Drama'],
          actors: 'Actor 2',
          plot: '',
          posterUrl: '',
        },
      ];
      const filterDto: FilterMoviesDto = { duration: 105, genres: [] };
      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue({ movies: mockMovies, genres: [] });

      const result = await service.filterMovies(filterDto);

      expect(result.length).toBe(2);
    });

    it('should throw NoMoviesFoundException if no movies match the filter criteria', async () => {
      const filterDto: FilterMoviesDto = { duration: 200, genres: ['Action'] };
      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue({ movies: [], genres: [] });

      await expect(service.filterMovies(filterDto)).rejects.toThrow(NoMoviesFoundException);
    });
  });

  describe('getRandomMovie', () => {
    it('should return a random movie from the list', async () => {
      const mockMovies: Movies = [
        {
          id: 1,
          title: 'Movie 1',
          year: 2020,
          runtime: 100,
          director: 'Director 1',
          genres: ['Action'],
          actors: 'Actor 1',
          plot: '',
          posterUrl: '',
        },
        {
          id: 2,
          title: 'Movie 2',
          year: 2021,
          runtime: 110,
          director: 'Director 2',
          genres: ['Drama'],
          actors: 'Actor 2',
          plot: '',
          posterUrl: '',
        },
      ];
      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue({ movies: mockMovies, genres: [] });

      const result = await service.getRandomMovie();

      expect(result.length).toBe(1);
      expect(mockMovies.some(movie => movie.id === result[0].id)).toBe(true);
    });

    it('should throw NoMoviesFoundException if no movies are available', async () => {
      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue({ movies: [], genres: [] });

      await expect(service.getRandomMovie()).rejects.toThrow(NoMoviesFoundException);
    });
  });
});
