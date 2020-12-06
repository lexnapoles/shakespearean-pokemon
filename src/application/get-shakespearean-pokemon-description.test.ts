import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'

import { PokemonSpecies } from '../apis/pokemon-api/pokemon-species'
import { getShakespeareanPokemonDescription } from './get-shakespearean-pokemon-description'

describe('getShakespeareanPokemonDescription', () => {
  it('returns a shakespearian version of the description', async () => {
    const pokemonName = 'charizard'

    const pokemonSpecies: PokemonSpecies = {
      id: 6,
      name: pokemonName,
      flavorText:
        'Spits fire that is hot enough to melt boulders.Known to cause forest fires unintentionally',
    }

    const getPokemonSpeciesByName = (_pokemon: string) => TE.right(pokemonSpecies)
    const getShakespeareanTranslation = (_text: string) =>
      TE.right(
        'Spits fire yond is hot enow to melt boulders. Known to cause forest fires unintentionally'
      )

    const getDescriptionWithDependencies = getShakespeareanPokemonDescription({
      getPokemonSpeciesByName,
      getShakespeareanTranslation,
    })

    const shakespeareanDescription = await getDescriptionWithDependencies(pokemonName)

    expect(shakespeareanDescription).toMatchObject(
      E.right(
        'Spits fire yond is hot enow to melt boulders. Known to cause forest fires unintentionally'
      )
    )
  })
})
