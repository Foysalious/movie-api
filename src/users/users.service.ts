import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

  ) { }

  async createUserByEmail(request: { password: string; email: string; name: string; }) {

    const salt = await bcrypt.genSaltSync(10);
    if (request.password)
      request.password = request.password
        ? await bcrypt.hashSync(request.password, salt)
        : null;
    const user = await this.userRepository.findOne({
      where: {
        email: request.email,
      }
    })
    if (user != undefined) {
      throw new UnauthorizedException("User Already Exist")
    }
    return await this.userRepository.save({
      email: request.email,
      password: request.password,
      name: request.name
    });
  }
}
