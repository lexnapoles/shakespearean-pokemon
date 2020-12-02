import { pipe } from 'fp-ts/lib/function'
import { chain, fromNullable, map, none, Option, some } from 'fp-ts/lib/Option'
import got from 'got'
import * as z from 'zod'

export type PokemonSpecies = {
  id: number
  name: string
  flavorText: string
}

export type GetPokemonSpeciesByName = (pokemonName: string) => Promise<Option<PokemonSpecies>>

const pokemonApiUrl = 'https://pokeapi.co/api/v2'

export const getPokemonSpeciesByName: GetPokemonSpeciesByName = async (pokemonName) => {
  const response = await got.get(`${pokemonApiUrl}/${pokemonSpeciesEndpoint(pokemonName)}`).json()

  return pipe(
    response,
    pokemonSpeciesResponseSchema.safeParse,
    (parsed) => (parsed.success ? some(parsed.data) : none),
    chain(({ id, name, flavor_text_entries }) =>
      pipe(
        flavor_text_entries.find(isEnglishLanguage),
        fromNullable,
        map(({ flavor_text }) => ({
          id,
          name,
          flavorText: flavor_text,
        }))
      )
    )
  )
}

const pokemonSpeciesEndpoint = (pokemonName: string) => `pokemon-species/${pokemonName}`

const isEnglishLanguage = ({ language: { name } }: { language: { name: string } }) => name === 'en'

const namedResource = z.object({
  name: z.string(),
  url: z.string().url(),
})

const resource = z.object({
  name: z.string().optional(),
})

const pokemonSpeciesResponseSchema = z.object({
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
  evolves_from_species: namedResource,
  evolution_chain: resource,
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
