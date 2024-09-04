import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { DbService } from '../db/db.service';
import { DatabaseLoadException } from '../db/exceptions/database-load.exception';
import { Genres } from './entities';

jest.mock('../db/db.service');

describe('GenresService', () => {
  let service: GenresService;
  let dbService: DbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenresService, DbService],
    }).compile();

    service = module.get<GenresService>(GenresService);
    dbService = module.get<DbService>(DbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllGenres', () => {
    it('should return all genres', async () => {
      const mockGenres: Genres = ['Action', 'Comedy', 'Drama'];
      const mockDatabase = { genres: mockGenres, movies: [] };

      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue(mockDatabase);

      const result = await service.getAllGenres();

      expect(dbService.loadDatabase).toHaveBeenCalled();
      expect(result).toEqual(mockGenres);
    });

    it('should throw DatabaseLoadException if loading the database fails', async () => {
      const mockError = new DatabaseLoadException('Failed to load database');
      jest.spyOn(dbService, 'loadDatabase').mockRejectedValue(mockError);

      await expect(service.getAllGenres()).rejects.toThrow(
        DatabaseLoadException,
      );
    });

    it('should return an empty array if there are no genres', async () => {
      const mockDatabase = { genres: [], movies: [] };
      jest.spyOn(dbService, 'loadDatabase').mockResolvedValue(mockDatabase);

      const result = await service.getAllGenres();

      expect(result).toEqual([]);
    });
  });
});
