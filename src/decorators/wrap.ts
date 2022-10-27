export function Wrap(wrapKey: string) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const value = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return { [wrapKey]: await value.apply(this, args) };
    };
  };
}
