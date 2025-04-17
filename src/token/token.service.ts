import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class TokenService {
  constructor(private readonly _prismaService: PrismaService) {}

  async create(value: string, userId: number, expiresAt: Date) {
    return await this._prismaService.token.create({
      data: { value, userId, expiresAt },
      include: { user: true },
    });
  }

  async delete(id: number) {
    return await this._prismaService.token.delete({
      where: { id },
      include: { user: true },
    });
  }

  async findByValue(value: string) {
    return await this._prismaService.token.findFirst({
      where: { value },
      include: { user: true },
    });
  }
}
