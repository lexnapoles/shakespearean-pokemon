import {
  getShakespearianPokemonDescription,
  PokemonSpecies,
} from './get-shakespearian-pokemon-description'

describe('getShakespearianPokemonDescription', () => {
  it('gets the pokemon species by name', async () => {
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

    const getPokemonSpeciesByName = (_pokemon: string) => Promise.resolve(pokemonSpecies)

    const getDescriptionWithDependencies = getShakespearianPokemonDescription(
      getPokemonSpeciesByName
    )

    const species = await getDescriptionWithDependencies(pokemonName)

    expect(species).toMatchObject<PokemonSpecies>(pokemonSpecies)
  })
})
