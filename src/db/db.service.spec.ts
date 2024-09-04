import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from './db.service';
import { Database } from './entities';
import { DatabaseLoadException } from './exceptions/database-load.exception';
import { DatabaseSaveException } from './exceptions/database-save.exception';
import * as fs from 'fs';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
  existsSync: jest.fn(),
}));

describe('DbService', () => {
  let service: DbService;
  const mockDbPath = 'some/path/to/db.json';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbService],
    }).compile();

    service = module.get<DbService>(DbService);
    (service as any).dbPath = mockDbPath;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadDatabase', () => {
    it('should load and parse the database file', async () => {
      const mockData = JSON.stringify({ movies: [], genres: [] });
      (fs.promises.readFile as jest.Mock).mockResolvedValue(mockData);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = await service.loadDatabase();

      expect(fs.promises.readFile).toHaveBeenCalledWith(mockDbPath, 'utf8');
      expect(result).toEqual({ movies: [], genres: [] });
    });

    it('should throw DatabaseLoadException if reading the file fails', async () => {
      const mockError = new Error('Failed to read file');
      (fs.promises.readFile as jest.Mock).mockRejectedValue(mockError);
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      await expect(service.loadDatabase()).rejects.toThrow(
        DatabaseLoadException,
      );
    });

    it('should throw DatabaseLoadException if the file does not exist', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await expect(service.loadDatabase()).rejects.toThrow(
        DatabaseLoadException,
      );
    });

    it('should throw DatabaseLoadException if JSON parsing fails', async () => {
      (fs.promises.readFile as jest.Mock).mockResolvedValue('invalid json');
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      await expect(service.loadDatabase()).rejects.toThrow(
        DatabaseLoadException,
      );
    });
  });

  describe('saveDatabase', () => {
    it('should save the database to the file', async () => {
      const mockDatabase: Database = { movies: [], genres: [] };

      await service.saveDatabase(mockDatabase);

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        mockDbPath,
        JSON.stringify(mockDatabase, null, 2),
      );
    });

    it('should throw DatabaseSaveException if writing the file fails', async () => {
      const mockError = new Error('Failed to write file');
      (fs.promises.writeFile as jest.Mock).mockRejectedValue(mockError);

      const mockDatabase: Database = { movies: [], genres: [] };

      await expect(service.saveDatabase(mockDatabase)).rejects.toThrow(
        DatabaseSaveException,
      );
    });
  });
});
