export function createDecorator(
  key: string,
  value: any,
): ClassDecorator & MethodDecorator {
  return (target: any, propertyKey?: string | symbol) => {
    // Armazena o valor exatamente como foi passado
    if (!propertyKey) {
      Reflect.defineMetadata(key, value, target);
    } else {
      Reflect.defineMetadata(key, value, target, propertyKey);
    }
  };
}
