import { lefts } from 'fp-ts/lib/Array'
import { right, fold } from 'fp-ts/lib/Either'
import { none, some } from 'fp-ts/lib/Option'
import { notFoundError } from './error'
import { getShakespearianPokemonDescription } from './get-shakespearian-pokemon-description'
import { PokemonSpecies } from './pokemon-species'

describe('getShakespearianPokemonDescription', () => {
  it('returns the pokemon species by name', async () => {
    const pokemonName = 'charizard'

    const pokemonSpecies: PokemonSpecies = {
      id: 6,
      name: pokemonName,
      flavorText: {
        flavorText:
          'Spits fire that is hot enough to melt boulders.Known to cause forest fires unintentionally',
        language: 'en',
      },
    }

    const getPokemonSpeciesByName = (_pokemon: string) => Promise.resolve(some(pokemonSpecies))

    const getDescriptionWithDependencies = getShakespearianPokemonDescription(
      getPokemonSpeciesByName
    )

    const species = await getDescriptionWithDependencies(pokemonName)

    expect(species).toMatchObject(right(pokemonSpecies))
  })

  it("returns a NotFoundError when the pokemon species doesn't exist", async () => {
    const getPokemonSpeciesByName = (_pokemon: string) => Promise.resolve(none)

    const getDescriptionWithDependencies = getShakespearianPokemonDescription(
      getPokemonSpeciesByName
    )

    const species = await getDescriptionWithDependencies('missingStr')

    const [error] = lefts([species])

    expect(error).toMatchObject(notFoundError('No pokemon found'))
  })
})
