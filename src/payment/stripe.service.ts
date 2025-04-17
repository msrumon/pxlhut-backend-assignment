import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';

import { User } from 'prisma/client';
import { PrismaService } from '../prisma.service';
import { PaymentDto } from './payment.dto';

@Injectable()
export class StripeService {
  private readonly _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  constructor(private readonly _prismaService: PrismaService) {}

  async createCheckoutSession(user: User, data: PaymentDto) {
    const session = await this._stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: data.items.map((item) => ({
        price_data: {
          product_data: { name: item.name },
          unit_amount: item.price,
          currency: 'bdt',
        },
        quantity: item.quantity,
      })),
      metadata: { user: user.id },
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    const order = await this._prismaService.order.create({
      data: {
        userId: user.id,
        amount: session.amount_total!,
        stripeSessionId: session.id,
        stripeSessionExpiresAt: new Date(session.expires_at * 1000),
      },
    });
    return { session, order };
  }
}
