import 'express';

import type { Order, Token, User } from 'prisma/client';

type ReqUser = User & { tokens?: Array<Token>; orders?: Array<Order> };
type ReqToken = Token & { user?: User };

declare global {
  namespace Express {
    interface Request {
      user?: ReqUser;
      token?: ReqToken;
    }
  }
}
