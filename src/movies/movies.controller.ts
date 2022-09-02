import { Controller, Get, Post, Body, Res, UsePipes, ValidationPipe, } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Response } from 'express';

@Controller('api/v1')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Post('movie')
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createMovieDto: CreateMovieDto, @Res() response: Response) {
    createMovieDto.user_id = response.locals.userPayload._id
    this.moviesService.create(createMovieDto);
    return response.status(201);
  }

  @Get()
   findAll( @Res() response: Response) {
    const userId = response.locals.userPayload._id
    return this.moviesService.findAll(userId);
  }
}
