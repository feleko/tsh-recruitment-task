import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseLoadException extends HttpException {
  constructor(error: any) {
    super(
      `Error loading database: ${error.message || error}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
