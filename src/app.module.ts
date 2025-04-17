import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60 * 1000, limit: 10 }] }),
    AuthModule,
    PaymentModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }, PrismaService],
})
export class AppModule {}
