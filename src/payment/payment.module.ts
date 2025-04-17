import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { PaymentController } from './payment.controller';
import { StripeService } from './stripe.service';

@Module({
  controllers: [PaymentController],
  providers: [StripeService, PrismaService],
})
export class PaymentModule {}
