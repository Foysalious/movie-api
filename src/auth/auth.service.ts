import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/users.repository';
import { isString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';

type decodedToken = null | {
  [key: string]: any;
} | string
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private userService: UsersService,
  ) { }

  async register(request: RegisterDto): Promise<{ token: string }> {
    const user = await this.userService.createUserByEmail(request);
    return await this.getAccessToken(user._id, user.name, user.email);
  }

  async login(authCredentialDto: LoginDto) {
    const { email, password } = authCredentialDto;
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      }
    });
    if (user == undefined)
      throw new NotFoundException("No User Found")

    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch) throw new BadRequestException('Incorrect username or password');
    return await this.getAccessToken(user._id, user.name, user.email);
  }


  async jwtTokenDecode(jwt: string): Promise<JwtPayload> {
    const decodedToken: decodedToken = this.jwtService.decode(jwt);
    if (!decodedToken || isString(decodedToken)) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    this.getProfile({ email: decodedToken.email })
    return { id: decodedToken.id, name: decodedToken.name, email: decodedToken.email };
  }

  async getAccessToken(
    id: string,
    name: string,
    email: string,
  ): Promise<{ token: string }> {
    const payload: JwtPayload = { id, name, email };
    const secret = { secret: process.env.APP_SECRET ?? 'topsecret51' };
    const token = this.jwtService.sign(payload, secret);
    return { token };
  }

  async getProfile(userInfo: { email: string }) {
    const user = await this.userRepository.findOne({
      where: {
        email: userInfo.email,
      }, select: ['_id', 'email']
    });
    if (user == undefined) {
      throw new NotFoundException("No User Found")
    }
    return user
  }
}
