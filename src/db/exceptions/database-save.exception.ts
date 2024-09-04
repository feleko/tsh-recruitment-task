import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseSaveException extends HttpException {
  constructor(error: any) {
    super(
      `Failed to save database: ${error.message || error}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
