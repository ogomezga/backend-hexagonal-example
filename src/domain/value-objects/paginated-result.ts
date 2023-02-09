export type PaginatedResult<T> = {
  items: T[];
  totalItems: number;
  pageSize: number;
  pageNumber: number;
};

export type PaginatedResultWithFilters<T, F> = PaginatedResult<T> & {
  availableFilters: AvailableFilters<F>;
};

export type AvailableFilters<T> = {
  [K in keyof T]: FilterOptions[];
};

export type FilterOptions = { name: string; value: string };

export function getOptionsValues(options: FilterOptions[]): string[] {
  return options.map((option) => option.value);
}

export function makeFilterOptions(options: string[]): FilterOptions[] {
  return options.filter((option) => option).map((option) => ({ name: option, value: option }));
}
