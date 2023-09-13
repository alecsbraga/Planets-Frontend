export const isEmpty = (value:any): boolean =>
  !!(
    value == null ||
    value === "" ||
    (value instanceof Array && value.length === 0)
  );
