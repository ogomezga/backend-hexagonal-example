type PostProcess<T> = (converted: T) => T;

type ValidType<T> = (input: any) => T;
type BaseArgs<T> = { value: Optional<any>; defaultValue?: Optional<T>; postProcess?: PostProcess<T>; type: ValidType<T> };

type Optional<T> = T | null | undefined;

const noneValues = [null, undefined];

type ConvertSafely = <T>(args: BaseArgs<T>) => T | null;

export const convertSafely: ConvertSafely = ({ value, type, defaultValue = null, postProcess }) => {
  const result = noneValues.includes(value) ? defaultValue : type(value);
  if (!result) return result;
  return postProcess ? postProcess(result) : result;
};

export const convertToString = (args: Omit<BaseArgs<string>, 'type'>) => {
  return convertSafely({ type: (input) => String(input), ...args });
};

export const convertToStringArray = (args: Omit<BaseArgs<string[]>, 'type'>) => {
  return convertSafely({ type: (input) => Array.from(input), ...args });
};

export const convertToNumber = (args: Omit<BaseArgs<number>, 'type'>) => {
  return convertSafely({ type: (input) => Number(input), ...args });
};