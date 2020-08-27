import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import { signin } from '../../test/auth-helper';
import { OrderStatus } from '@bwtickets/common';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: 'concert',
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
  });
  await ticket.save();

  const user = signin();

  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .del(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order has been cancelled', async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: 'concert',
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
  });
  await ticket.save();

  const user = signin();

  // make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make a request to cancel the order
  await request(app)
    .del(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
