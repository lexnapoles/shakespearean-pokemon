import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import { flow, pipe } from 'fp-ts/lib/function'
import got from 'got'
import {
  pokemonSpeciesResponseSchema,
  PokemonSpeciesResponseSchema,
} from './pokemon-species-response-schema'
import { trim } from '../../../utils/trim'
import { ApiError, notFoundError } from '../../../common-types'

export type PokemonSpecies = {
  id: number
  name: string
  flavorText: string
}

export type GetPokemonSpeciesByName = (
  pokemonName: string
) => TE.TaskEither<ApiError, PokemonSpecies>

const pokemonApiUrl = 'https://pokeapi.co/api/v2'

export const getPokemonSpeciesByName: GetPokemonSpeciesByName = (pokemonName) => {
  const toPokemonSpecies = (id: number) => (name: string) => (flavorText: string) => ({
    id,
    name,
    flavorText,
  })

  return pipe(
    TE.tryCatch(
      () => got.get(`${pokemonApiUrl}/${pokemonSpeciesEndpoint(pokemonName)}`).json(),
      (err) => (console.error(err), notFoundError('No pokemon found'))
    ),
    TE.chainEitherKW(
      flow(
        parsePokemonSpeciesResponse,
        E.mapLeft(() => notFoundError('No pokemon found')),
        E.chain(({ id, flavor_text_entries, name }) =>
          pipe(
            flavor_text_entries.find(isEnglishLanguage),
            E.fromNullable(notFoundError('No english text found')),
            E.map(flow(({ flavor_text }) => flavor_text, trim, toPokemonSpecies(id)(name)))
          )
        )
      )
    )
  )
}

const pokemonSpeciesEndpoint = (pokemonName: string) => `pokemon-species/${pokemonName}`

const isEnglishLanguage = ({ language: { name } }: { language: { name: string } }) => name === 'en'

const parsePokemonSpeciesResponse = (
  response: unknown
): E.Either<string, PokemonSpeciesResponseSchema> => {
  const parsedResponse = pokemonSpeciesResponseSchema.safeParse(response)

  return parsedResponse.success ? E.right(parsedResponse.data) : E.left('Parsing failed')
}
