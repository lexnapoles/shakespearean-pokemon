type ShakespeareanPokemonDescriptionDto = {
  name: string
  description: string
}

export function toShakespeareanPokemonDescriptionDto(
  name: string,
  description: string
): ShakespeareanPokemonDescriptionDto {
  return { name, description }
}

export type ApiError = NotFoundError | InternalError

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

export function isNotFoundError(error: ApiError): error is NotFoundError {
  return error.type === 'NotFoundError'
}

export type InternalError = {
  type: 'InternalError'
  message: string
}

export function internalError(message: string): InternalError {
  return {
    type: 'InternalError',
    message,
  }
}

export function isInternalError(error: ApiError): error is InternalError {
  return error.type === 'InternalError'
}
