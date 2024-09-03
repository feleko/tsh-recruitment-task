import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Database } from './entities';
import { DatabaseLoadException } from './exceptions/database-load.exception';
import { DatabaseSaveException } from './exceptions/database-save.exception';


@Injectable()
export class DbService {
  private readonly dbPath = path.join(__dirname, process.env.DB_PATH);
  private readonly logger = new Logger(DbService.name);

  async loadDatabase(): Promise<Database> {
    try {
      if (!fs.existsSync(this.dbPath)) {
        this.logger.warn(`Database file not found at ${this.dbPath}`);
        throw new DatabaseLoadException(`Database file not found at ${this.dbPath}`);
      }
      const data = await fs.promises.readFile(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Failed to load database: ${error.message}`);
      if (error instanceof SyntaxError) {
        throw new DatabaseLoadException(`Invalid JSON format in ${this.dbPath}: ${error.message}`);
      }
      throw new DatabaseLoadException(error);
    }
  }

  async saveDatabase(database: Database): Promise<void> {
    try {
      await fs.promises.writeFile(this.dbPath, JSON.stringify(database, null, 2));
    } catch (error) {
      this.logger.error(`Failed to save database: ${error.message}`);
      throw new DatabaseSaveException(error);
    }
  }
}
