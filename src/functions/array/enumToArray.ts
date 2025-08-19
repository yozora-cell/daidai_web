type NonFunctional<T> = T extends Function ? never : T

/**
 * Helper to produce an array of enum values.
 * @param enumeration Enumeration object.
 */
// Add the 'extends object' constraint to the generic type T
export function enumToArray<T extends object>(enumeration: T): NonFunctional<T[keyof T]>[] {
  return (
    Object.keys(enumeration)
      .filter((key) => isNaN(Number(key)))
      // @ts-ignore TYPE NEEDS FIXING
      .map((key) => enumeration[key as keyof T]) // Also, it's good practice to type 'key' here
      .filter((val) => typeof val === 'number' || typeof val === 'string') as NonFunctional<T[keyof T]>[]
  )
}