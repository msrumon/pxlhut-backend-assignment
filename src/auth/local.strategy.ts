import {
  UnauthorizedException,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { compare } from 'bcryptjs';
import { Strategy } from 'passport-local';

import { PrismaService } from '../prisma.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly _logger = new Logger(LocalStrategy.name);

  constructor(private readonly _prismaService: PrismaService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, pass: string) {
    try {
      const user = await this._prismaService.user.findUniqueOrThrow({
        where: { email },
        include: { tokens: true, orders: true },
      });
      if (!(await compare(pass, user.password))) {
        throw new UnauthorizedException('Password is incorrect');
      }
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found', { cause: error });
      }
      if (error instanceof HttpException) {
        throw error;
      }
      this._logger.error(error);
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
      });
    }
  }
}
