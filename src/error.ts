export type ApiError = NotFoundError

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

export function isNotFound(error: ApiError): error is NotFoundError {
  return error.type === 'NotFoundError'
}
