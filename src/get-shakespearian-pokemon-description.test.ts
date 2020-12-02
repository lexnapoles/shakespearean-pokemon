import { lefts } from 'fp-ts/lib/Array'
import { right } from 'fp-ts/lib/Either'
import { none, some } from 'fp-ts/lib/Option'
import { notFoundError } from './error'
import { getShakespearianPokemonDescription } from './get-shakespearian-pokemon-description'
import { PokemonSpecies } from './pokemon-species'

const getShakespearianTranslation = (text: string) => Promise.resolve(text)

describe('getShakespearianPokemonDescription', () => {
  it("returns a NotFoundError when the pokemon species doesn't exist", async () => {
    const getPokemonSpeciesByName = (_pokemon: string) => Promise.resolve(none)

    const getDescriptionWithDependencies = getShakespearianPokemonDescription({
      getPokemonSpeciesByName,
      getShakespearianTranslation,
    })

    const species = await getDescriptionWithDependencies('missingStr')

    const [error] = lefts([species])

    expect(error).toMatchObject(notFoundError('No pokemon found'))
  })

  it('returns a shakespearian version of the description', async () => {
    const pokemonName = 'charizard'

    const pokemonSpecies: PokemonSpecies = {
      id: 6,
      name: pokemonName,
      flavorText:
        'Spits fire that is hot enough to melt boulders.Known to cause forest fires unintentionally',
    }

    const getPokemonSpeciesByName = (_pokemon: string) => Promise.resolve(some(pokemonSpecies))
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
