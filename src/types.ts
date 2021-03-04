export interface potentialValuesMap {
  [key: number]: Array<Array<number>>;
}

export interface allowedValue {
  row?: number;
  column?: number;
  value: number;
}
