import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { ReqUser } from 'types';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt.guard';
import { LocalGuard } from './local.guard';
import { LoginGuard } from './login.guard';
import { TokenGuard } from './token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: AuthDto) {
    const result = await this._authService.signUp(dto.email, dto.password);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User has been registered',
      data: { user: result },
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard, LoginGuard)
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    if ('token' in req) {
      return await this.refresh(req, res);
    }

    const { accessToken, refreshToken } = await this._authService.signIn(
      req.user as ReqUser,
    );
    return res
      .cookie('_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        statusCode: HttpStatus.OK,
        message: 'User has been logged in',
        data: {
          access_token: accessToken,
          token_type: 'Bearer',
          expires_in: '3600',
        },
      });
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@Req() req: Request) {
    return {
      statusCode: HttpStatus.OK,
      message: 'User has been fetched',
      data: req.user,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(TokenGuard)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this._authService.refreshToken(
      req.token!,
    );
    return res
      .cookie('_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        statusCode: HttpStatus.OK,
        message: 'Token has been refreshed',
        data: {
          access_token: accessToken,
          token_type: 'Bearer',
          expires_in: '3600',
        },
      });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(TokenGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this._authService.clearToken(req.token!);
    return res.clearCookie('_token').send();
  }
}
