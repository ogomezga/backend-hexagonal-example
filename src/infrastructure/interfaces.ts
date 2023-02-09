export type FunctionType = (...args: any[]) => any;
export type Properties<T> = Pick<T, { [K in keyof T]: T[K] extends FunctionType ? never : K }[keyof T]>;
export type Identifiable = { id: string };
export type ConstructorProperties<T extends Identifiable> = Omit<Properties<T>, 'id'> & Partial<Pick<T, 'id'>>;
export type Writable<T> = {
  -readonly [K in keyof T]: T[K];
};
export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
export type OptionalStringHack = string & { zzIgnoreMe?: never };
export type HintedValues<T> = T | OptionalStringHack;
export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
export type WritableProperties<T> = Writable<Properties<T>>;
export type WritableKey<T> = keyof WritableProperties<T>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type ReturnTypeAsync<T extends (...args: any[]) => any> = ThenArg<ReturnType<T>>;

export type FieldValidationError = { field: string; code: string; value: any; data?: any };

export type BaseObject = { [key: string]: any };
