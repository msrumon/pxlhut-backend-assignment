import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { User } from 'prisma/client';
import { JwtGuard } from '../auth/jwt.guard';
import { PaymentDto } from './payment.dto';
import { StripeService } from './stripe.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly _stripeService: StripeService) {}

  @UseGuards(JwtGuard)
  @Post('checkout')
  async checkout(@Body() dto: PaymentDto, @Req() req: Request) {
    const { session } = await this._stripeService.createCheckoutSession(
      req.user as User,
      dto,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Checkout has been created',
      data: { url: session.url },
    };
  }
}
