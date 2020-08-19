import { Publisher, OrderCancelledEvent, Subjects } from '@bwtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
