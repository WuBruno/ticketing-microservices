import 'express-async-errors';

import { NotFoundError, currentUser, errorHandler } from '@bwtickets/common';

import cookieSession from 'cookie-session';
import { deleteOrderRouter } from './routes/delete';
import express from 'express';
import { indexOrderRouter } from './routes';
import { json } from 'body-parser';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
