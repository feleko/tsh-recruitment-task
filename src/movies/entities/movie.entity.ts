export interface Movie {
  id: number;
  title: string;
  year: number;
  runtime: number;
  director: string;
  genres: string[];
  actors?: string;
  plot?: string;
  posterUrl?: string;
}

export type ICreateMovieDto = Omit<Movie, 'id'>;

export type Movies = Array<Movie>;
