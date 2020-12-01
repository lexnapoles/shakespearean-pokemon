export type Error = NotFoundError

export type NotFoundError = {
  type: 'NotFoundError'
  message: string
}

export function notFoundError(message: string): NotFoundError {
  return {
    type: 'NotFoundError',
    message,
  }
}

export function isNotFound(error: Error): error is NotFoundError {
  return error.type === 'NotFoundError'
}
