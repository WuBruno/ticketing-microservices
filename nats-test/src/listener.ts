import nats, { Message, Stan } from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// These help manually shut off the systems
process.on('SIGINT', () => stan.close()); // For interruption
process.on('SIGTERM', () => stan.close()); // For restarting
