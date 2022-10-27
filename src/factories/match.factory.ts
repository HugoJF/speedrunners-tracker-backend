import { faker } from '@faker-js/faker';
import { maps } from '../types';

export const fakeMatch = (overrides?) => ({
  p1_score: faker.datatype.number({ min: 0, max: 3 }),
  p2_score: faker.datatype.number({ min: 0, max: 3 }),
  map: faker.helpers.arrayElement(Object.values(maps)),
  ...overrides,
});
