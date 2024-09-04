import { ICreateMovieDto } from '../entities';
import { Genres } from '../../genres/entities';

import { JoiSchema } from 'nestjs-joi';
import * as Joi from 'joi';

export const YEAR_OF_CREATION_OF_THE_FIRST_FILM = 1895;

export class CreateMovieDto implements ICreateMovieDto {
  @JoiSchema(
    Joi.string().max(255).required().messages({
      'string.base': 'Title must be a string.',
      'string.empty': 'Title cannot be empty.',
      'string.max': 'Title cannot be longer than 255 characters.',
      'any.required': 'Title is required.',
    }),
  )
  title: string;

  @JoiSchema(
    Joi.number()
      .required()
      .min(YEAR_OF_CREATION_OF_THE_FIRST_FILM)
      .messages({
        'number.base': 'Year must be a number.',
        'any.required': 'Year is required.',
        'number.min': `Year must be greater than or equal to ${YEAR_OF_CREATION_OF_THE_FIRST_FILM}.`,
      }),
  )
  year: number;

  @JoiSchema(
    Joi.number().min(Number.MIN_VALUE).required().messages({
      'number.base': 'Runtime must be a number.',
      'any.required': 'Runtime is required.',
      'number.min': 'Runtime must be greater than 0.',
    }),
  )
  runtime: number;

  @JoiSchema(
    Joi.string().max(255).required().messages({
      'string.base': 'Director must be a string.',
      'string.empty': 'Director cannot be empty.',
      'string.max': 'Director cannot be longer than 255 characters.',
      'any.required': 'Director is required.',
    }),
  )
  director: string;

  @JoiSchema(
    Joi.array().items(Joi.string()).required().messages({
      'array.base': 'Genres must be an array.',
      'array.includes': 'Genres must contain valid strings.',
      'any.required': 'At least one genre is required.',
    }),
  )
  genres: Genres;

  @JoiSchema(
    Joi.string().optional().messages({
      'string.base': 'Actors must be a string.',
    }),
  )
  actors?: string;

  @JoiSchema(
    Joi.string().optional().messages({
      'string.base': 'Plot must be a string.',
    }),
  )
  plot?: string;

  @JoiSchema(
    Joi.string().uri().optional().messages({
      'string.base': 'Poster URL must be a string.',
      'string.uri': 'Poster URL must be a valid URI.',
    }),
  )
  posterUrl?: string;
}
