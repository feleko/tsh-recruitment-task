import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateGenresException extends HttpException {
  constructor() {
    super('Duplicate genres are not allowed.', HttpStatus.BAD_REQUEST);
  }
}
