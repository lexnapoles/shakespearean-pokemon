import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

import { PokemonSpecies } from '../apis/pokemon-api/pokemon-species'
import { getShakespearianPokemonDescription } from './get-shakespearian-pokemon-description'

describe('getShakespearianPokemonDescription', () => {
  it('returns a shakespearian version of the description', async () => {
    const pokemonName = 'charizard'

    const pokemonSpecies: PokemonSpecies = {
      id: 6,
      name: pokemonName,
      flavorText:
        'Spits fire that is hot enough to melt boulders.Known to cause forest fires unintentionally',
    }

    const getPokemonSpeciesByName = (_pokemon: string) => TE.right(pokemonSpecies)
    const getShakespearianTranslation = (_text: string) =>
      TE.right(
        'Spits fire yond is hot enow to melt boulders. Known to cause forest fires unintentionally'
      )

    const getDescriptionWithDependencies = getShakespearianPokemonDescription({
      getPokemonSpeciesByName,
      getShakespearianTranslation,
    })

    const shakespearianDescription = await getDescriptionWithDependencies(pokemonName)

    expect(shakespearianDescription).toMatchObject(
      E.right(
        'Spits fire yond is hot enow to melt boulders. Known to cause forest fires unintentionally'
      )
    )
  })
})
