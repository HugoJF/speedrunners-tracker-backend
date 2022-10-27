import { plainToInstance } from 'class-transformer';

export function ToInstance(model: Parameters<typeof plainToInstance>[0]) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const value = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return plainToInstance(model, await value.apply(this, args));
    };
  };
}
