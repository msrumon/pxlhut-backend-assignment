import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import { TokenService } from '../token/token.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const { _token } = request.cookies;

    if (!_token) {
      throw new UnauthorizedException('Token is missing');
    }

    let payload: Record<string, string>;
    try {
      payload = await this._jwtService.verifyAsync(_token, {
        ignoreExpiration: true,
      });
    } catch {
      throw new UnauthorizedException('Token is invalid');
    }

    const jwtId = payload.jti;
    const userId = payload.sub;

    if (!jwtId || !userId) {
      throw new UnauthorizedException('Token is malformed');
    }

    const token = await this._tokenService.findByValue(jwtId);

    if (
      !token ||
      token.userId !== Number(userId) ||
      token.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Token is unrecognized or expired');
    }

    request.token = token;
    return true;
  }
}
