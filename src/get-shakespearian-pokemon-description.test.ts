import { right } from 'fp-ts/lib/Either'
import { PokemonSpecies } from './apis/pokemon-api/pokemon-species'
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

    const getPokemonSpeciesByName = (_pokemon: string) => Promise.resolve(right(pokemonSpecies))
    const getShakespearianTranslation = (_text: string) =>
      Promise.resolve(
        'Spits fire yond is hot enow to melt boulders. Known to cause forest fires unintentionally'
      )

    const getDescriptionWithDependencies = getShakespearianPokemonDescription({
      getPokemonSpeciesByName,
      getShakespearianTranslation,
    })

    const shakespearianDescription = await getDescriptionWithDependencies(pokemonName)

    expect(shakespearianDescription).toMatchObject(
      right(
        'Spits fire yond is hot enow to melt boulders. Known to cause forest fires unintentionally'
      )
    )
  })
})
