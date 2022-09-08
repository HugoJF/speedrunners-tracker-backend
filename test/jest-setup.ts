import { startDynamodb, stopDynamodb } from './dynamodb-setup';

beforeAll(async () => {
  await startDynamodb();
}, 60000);

afterAll(() => {
  stopDynamodb();
}, 15000);
