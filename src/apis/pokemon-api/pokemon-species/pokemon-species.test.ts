import { left, right } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import nock from 'nock'
import { getPokemonSpeciesByName } from '.'
import { notFoundError } from '../../../common-types'
import { clone } from '../../../utils/clone'

describe('getPokemonSpeciesByName', () => {
  it('gets a pokemon species by name', async () => {
    const pokemonName = 'wormadam'

    nock('https://pokeapi.co/api/v2')
      .get(`/pokemon-species/${pokemonName}`)
      .reply(200, pokemonSpeciesStub)

    const lazyFetchSpecies = getPokemonSpeciesByName(pokemonName)

    const species = await lazyFetchSpecies()

    expect(species).toMatchObject(
      right({
        id: 413,
        name: pokemonName,
        flavorText:
          'When BURMY evolved, its cloak became a part of this Pokémon’s body. The cloak is never shed.',
      })
    )
  })

  it('returns a not found error when the pokemon species is not found', async () => {
    const pokemonName = 'wormadam'

    nock('https://pokeapi.co/api/v2').get(`/pokemon-species/${pokemonName}`).reply(404)

    const lazyFetchSpecies = getPokemonSpeciesByName(pokemonName)

    const species = await lazyFetchSpecies()

    expect(species).toMatchObject(left(notFoundError('No pokemon found')))
  })

  it("returns a an error when there's no english text", async () => {
    const pokemonName = 'wormadam'

    const stubWithoutFlavorText = pipe(
      pokemonSpeciesStub,
      clone,
      (obj) => (
        (obj.flavor_text_entries = obj.flavor_text_entries.filter(
          ({ language: { name } }: { language: { name: string } }) => name !== 'en'
        )),
        obj
      )
    )

    nock('https://pokeapi.co/api/v2')
      .get(`/pokemon-species/${pokemonName}`)
      .reply(200, stubWithoutFlavorText)

    const lazyFetchSpecies = getPokemonSpeciesByName(pokemonName)

    const species = await lazyFetchSpecies()

    expect(species).toMatchObject(left(notFoundError('No english text found')))
  })
})

const pokemonSpeciesStub = {
  base_happiness: 70,
  capture_rate: 45,
  color: {
    name: 'green',
    url: 'https://pokeapi.co/api/v2/pokemon-color/5/',
  },
  egg_groups: [
    {
      name: 'bug',
      url: 'https://pokeapi.co/api/v2/egg-group/3/',
    },
  ],
  evolution_chain: {
    url: 'https://pokeapi.co/api/v2/evolution-chain/213/',
  },
  evolves_from_species: {
    name: 'burmy',
    url: 'https://pokeapi.co/api/v2/pokemon-species/412/',
  },
  flavor_text_entries: [
    {
      flavor_text:
        'When BURMY evolved, its cloak\nbecame a part of this Pokémon’s\nbody. The cloak is never shed.',
      language: {
        name: 'en',
        url: 'https://pokeapi.co/api/v2/language/9/',
      },
      version: {
        name: 'diamond',
        url: 'https://pokeapi.co/api/v2/version/12/',
      },
    },
    {
      flavor_text:
        'À l’évolution, son corps absorbe\nles matériaux à proximité et peut\nainsi présenter divers aspects.',
      language: {
        name: 'fr',
        url: 'https://pokeapi.co/api/v2/language/5/',
      },
      version: {
        name: 'black',
        url: 'https://pokeapi.co/api/v2/version/17/',
      },
    },
  ],
  form_descriptions: [
    {
      description:
        "Forms have different stats and movepools.  During evolution, Burmy's current cloak becomes Wormadam's form, and can no longer be changed.",
      language: {
        name: 'en',
        url: 'https://pokeapi.co/api/v2/language/9/',
      },
    },
  ],
  forms_switchable: false,
  gender_rate: 8,
  genera: [
    {
      genus: 'みのむしポケモン',
      language: {
        name: 'ja-Hrkt',
        url: 'https://pokeapi.co/api/v2/language/1/',
      },
    },

    {
      genus: 'Bagworm Pokémon',
      language: {
        name: 'en',
        url: 'https://pokeapi.co/api/v2/language/9/',
      },
    },
  ],
  generation: {
    name: 'generation-iv',
    url: 'https://pokeapi.co/api/v2/generation/4/',
  },
  growth_rate: {
    name: 'medium',
    url: 'https://pokeapi.co/api/v2/growth-rate/2/',
  },
  habitat: null,
  has_gender_differences: false,
  hatch_counter: 15,
  id: 413,
  is_baby: false,
  is_legendary: false,
  is_mythical: false,
  name: 'wormadam',
  names: [
    {
      language: {
        name: 'zh-Hant',
        url: 'https://pokeapi.co/api/v2/language/4/',
      },
      name: '結草貴婦',
    },

    {
      language: {
        name: 'en',
        url: 'https://pokeapi.co/api/v2/language/9/',
      },
      name: 'Wormadam',
    },
  ],
  order: 441,
  pal_park_encounters: [
    {
      area: {
        name: 'forest',
        url: 'https://pokeapi.co/api/v2/pal-park-area/1/',
      },
      base_score: 70,
      rate: 20,
    },
  ],
  pokedex_numbers: [
    {
      entry_number: 413,
      pokedex: {
        name: 'national',
        url: 'https://pokeapi.co/api/v2/pokedex/1/',
      },
    },
    {
      entry_number: 46,
      pokedex: {
        name: 'original-sinnoh',
        url: 'https://pokeapi.co/api/v2/pokedex/5/',
      },
    },
  ],
  shape: {
    name: 'blob',
    url: 'https://pokeapi.co/api/v2/pokemon-shape/5/',
  },
  varieties: [
    {
      is_default: true,
      pokemon: {
        name: 'wormadam-plant',
        url: 'https://pokeapi.co/api/v2/pokemon/413/',
      },
    },
  ],
}
