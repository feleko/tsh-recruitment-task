import { Genres } from '../../genres/entities';
import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';

export class FilterMoviesDto {
  @JoiSchema(Joi.number().min(Number.MIN_VALUE).optional().messages({
    'number.base': 'Duration must be a number.',
    'number.min': 'Duration must be greater than 0.',
  }))
  duration?: number;

  @JoiSchema(Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Genres must be an array.',
    'array.includes': 'Genres must contain valid strings.',
  }))
  genres?: Genres;
}
