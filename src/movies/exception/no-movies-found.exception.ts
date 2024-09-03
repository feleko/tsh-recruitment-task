import { HttpException, HttpStatus } from '@nestjs/common';

export class NoMoviesFoundException extends HttpException {
  constructor() {
    super('No movies found matching the criteria', HttpStatus.NOT_FOUND);
  }
}