import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidGenresException extends HttpException {
  constructor(invalidGenres: string[]) {
    super(
      `Invalid genres: ${invalidGenres.join(', ')}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
