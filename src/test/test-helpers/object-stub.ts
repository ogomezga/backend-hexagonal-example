export type ObjectStub<T extends { [key in string]: any }> = { [K in keyof T]: jest.Mock<ReturnType<T[K]>, Parameters<T[K]>> };
