import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly _logger = new Logger(JwtStrategy.name);

  constructor(private readonly _prismaService: PrismaService) {
    super({
      secretOrKey: process.env.JWT_SECRET!,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate({ sub }: Record<string, string>) {
    try {
      const user = await this._prismaService.user.findUniqueOrThrow({
        where: { id: Number(sub) },
        include: { tokens: true, orders: true },
      });
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found', { cause: error });
      }
      this._logger.error(error);
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
      });
    }
  }
}
