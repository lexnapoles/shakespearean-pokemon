import * as z from 'zod'

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
