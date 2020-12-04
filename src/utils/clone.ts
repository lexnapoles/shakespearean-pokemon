import { pipe } from 'fp-ts/lib/function'

export const clone = (obj: {}) => pipe(obj, JSON.stringify, JSON.parse)
