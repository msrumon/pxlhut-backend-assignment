import { randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { ReqToken, ReqUser } from 'types';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _userService: UserService,
    private readonly _tokenService: TokenService,
  ) {}

  async clearToken(token: ReqToken) {
    return await this._tokenService.delete(token.id);
  }

  decodeToken(token: string) {
    return this._jwtService.decode(token);
  }

  async refreshToken(token: ReqToken) {
    const accessToken = await this._generateAccessToken(token.user!);
    const refreshToken = await this._generateRefreshToken(token.user!);
    const decoded = this.decodeToken(refreshToken);
    await this._tokenService.delete(token.id);
    await this._tokenService.create(
      decoded.jti,
      token.userId,
      new Date(decoded.exp * 1000),
    );
    return { accessToken, refreshToken };
  }

  async signIn(user: ReqUser) {
    const accessToken = await this._generateAccessToken(user);
    const refreshToken = await this._generateRefreshToken(user);
    const decoded = this.decodeToken(refreshToken);
    await this._tokenService.create(
      decoded.jti,
      user.id,
      new Date(decoded.exp * 1000),
    );
    return { accessToken, refreshToken };
  }

  async signUp(email: string, pass: string) {
    const user = await this._userService.create(email, pass);
    const { password, ...result } = user;
    return result;
  }

  private async _generateAccessToken(user: ReqUser) {
    return await this._jwtService.signAsync({ sub: user.id });
  }

  private async _generateRefreshToken(user: ReqUser) {
    const jwtId = randomBytes(16).toString('hex');
    return await this._jwtService.signAsync(
      { sub: user.id },
      { expiresIn: '1d', jwtid: jwtId },
    );
  }
}
