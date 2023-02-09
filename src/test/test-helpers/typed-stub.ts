import Mock = jest.Mock;

export function typedStub<T extends (...args: any[]) => any>(): Mock<ReturnType<T>, Parameters<T>> {
  // @ts-ignore
  return jest.fn<ReturnType<T>, Parameters<T>>(() => null);
}
