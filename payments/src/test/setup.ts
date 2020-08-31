import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51HCMrYArpxMuq7l8GtyQyoO9zWmR6wMWFku6fhUx3Ik24VMn6fvfWCW8GRnKS1NzgGJUvkEuvDkRWLH6odyq96Gh00m7cImk1H';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
