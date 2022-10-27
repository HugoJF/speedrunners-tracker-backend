export function Unwrap(unwrapKey: string) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const value = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await value.apply(this, args);

      if (!(unwrapKey in result)) {
        const keys = Object.keys(result).join(', ');

        throw new Error(
          `Could not unwrap key '${unwrapKey}' from object (${keys})`,
        );
      }

      return result[unwrapKey];
    };
  };
}
