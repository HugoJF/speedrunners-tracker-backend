import { faker } from '@faker-js/faker';

export const fakeSprint = (overrides?) => ({
  name: faker.word.noun(),
  goal: faker.datatype.number({ min: 0, max: 10 }),
  p1_name: faker.name.firstName(),
  p1_score: faker.datatype.number({ min: 0, max: 10 }),
  p2_name: faker.name.firstName(),
  p2_score: faker.datatype.number({ min: 0, max: 10 }),
  ...overrides,
});
