import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { genSalt, hash } from 'bcryptjs';

import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  private readonly _logger = new Logger(UserService.name);

  constructor(private readonly _prismaService: PrismaService) {}

  async create(email: string, password: string) {
    try {
      password = await hash(password, await genSalt());
      return await this._prismaService.user.create({
        data: { email, password },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email is already registered', {
          cause: error,
        });
      }
      this._logger.error(error);
      throw new InternalServerErrorException('Something went wrong', {
        cause: error,
      });
    }
  }
}
