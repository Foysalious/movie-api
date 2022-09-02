import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './entities/movie.entity';

import { MoviesRepository } from './movies.repository';

@Injectable()
export class MoviesService {

  constructor(
    @InjectRepository(MoviesRepository)
    private movieRepository: MoviesRepository,

  ) { }
  create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieRepository.save(createMovieDto)
  }

  async findAll(userId: string): Promise<any> {
    return await this.movieRepository.find({ where: { user_id: userId } })
  }


}
