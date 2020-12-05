import { Either, right, left, chain, map, fromNullable, mapLeft } from 'fp-ts/lib/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import got from 'got'
import { ApiError, notFoundError } from '../../../error'
import {
  pokemonSpeciesResponseSchema,
  PokemonSpeciesResponseSchema,
} from './pokemonSpeciesResponseSchema'

export type PokemonSpecies = {
  id: number
  name: string
  flavorText: string
}

export type GetPokemonSpeciesByName = (
  pokemonName: string
) => Promise<Either<ApiError, PokemonSpecies>>

const pokemonApiUrl = 'https://pokeapi.co/api/v2'

export const getPokemonSpeciesByName: GetPokemonSpeciesByName = async (pokemonName) => {
  try {
    const response = await got.get(`${pokemonApiUrl}/${pokemonSpeciesEndpoint(pokemonName)}`).json()

    const toPokemonSpecies = (id: number) => (name: string) => (flavorText: string) => ({
      id,
      name,
      flavorText,
    })

    return pipe(
      response,
      parsePokemonSpeciesResponse,
      mapLeft((_msg) => notFoundError('No pokemon found')),
      chain(({ id, name, flavor_text_entries }) =>
        pipe(
          flavor_text_entries.find(isEnglishLanguage),
          fromNullable(notFoundError('No english text found')),
          map(flow(({ flavor_text }) => flavor_text, trimFlavorText, toPokemonSpecies(id)(name)))
        )
      )
    )
  } catch (e) {
    console.error(e)
    return left(notFoundError('Pokemon not found'))
  }
}

const pokemonSpeciesEndpoint = (pokemonName: string) => `pokemon-species/${pokemonName}`

const isEnglishLanguage = ({ language: { name } }: { language: { name: string } }) => name === 'en'

const parsePokemonSpeciesResponse = (
  response: unknown
): Either<string, PokemonSpeciesResponseSchema> => {
  const parsedResponse = pokemonSpeciesResponseSchema.safeParse(response)

  return parsedResponse.success ? right(parsedResponse.data) : left('Parsing failed')
}

function trimFlavorText(flavorText: string) {
  return flavorText.replace(/\s/g, ' ').trim()
}
