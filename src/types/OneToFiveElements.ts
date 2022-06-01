/**
 * A limited array of elements, from 1 to 5 max.
 */
export type OneToFiveElements<T> =
  | []
  | [T]
  | [T, T]
  | [T, T, T]
  | [T, T, T, T]
  | [T, T, T, T, T];
