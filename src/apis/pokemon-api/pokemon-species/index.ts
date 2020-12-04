import * as z from 'zod'
import { Either, right, left, chain, map, fromNullable, mapLeft } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import got from 'got'
import { ApiError, notFoundError } from '../../../error'

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

    return pipe(
      response,
      parsePokemonSpeciesResponse,
      mapLeft((_msg) => notFoundError('No pokemon found')),
      chain(({ id, name, flavor_text_entries }) =>
        pipe(
          flavor_text_entries.find(isEnglishLanguage),
          fromNullable(notFoundError('No english text found')),
          map(({ flavor_text }) => flavor_text.replace(/\s/g, ' ').trim()),
          map((flavorText) => ({
            id,
            name,
            flavorText,
          }))
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

const namedResource = z.object({
  name: z.string(),
  url: z.string().url(),
})
const resource = z.object({
  name: z.string().optional(),
})

export type PokemonSpeciesResponseSchema = z.infer<typeof pokemonSpeciesResponseSchema>

export const pokemonSpeciesResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  order: z.number(),
  gender_rate: z.number(),
  capture_rate: z.number(),
  base_happiness: z.number(),
  is_baby: z.boolean(),
  is_legendary: z.boolean(),
  is_mythical: z.boolean(),
  hatch_counter: z.number(),
  has_gender_differences: z.boolean(),
  forms_switchable: z.boolean(),
  growth_rate: z.object({
    name: z.string(),
    url: z.string().url(),
  }),
  pokedex_numbers: z.array(
    z.object({
      entry_number: z.number(),
      pokedex: namedResource,
    })
  ),
  egg_groups: z.array(namedResource),
  color: namedResource,
  shape: namedResource,
  evolves_from_species: namedResource.nullable(),
  evolution_chain: resource.nullable(),
  habitat: namedResource.nullable(),
  generation: namedResource,
  names: z.array(
    z.object({
      name: z.string(),
      language: namedResource,
    })
  ),
  flavor_text_entries: z.array(
    z.object({
      flavor_text: z.string(),
      language: namedResource,
      version: namedResource,
    })
  ),
  form_descriptions: z.array(
    z.object({
      description: z.string(),
      language: namedResource,
    })
  ),
  genera: z.array(
    z.object({
      genus: z.string(),
      language: namedResource,
    })
  ),
  varieties: z.array(
    z.object({
      is_default: z.boolean(),
      pokemon: namedResource,
    })
  ),
})
