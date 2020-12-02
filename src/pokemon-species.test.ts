import { some } from 'fp-ts/lib/Option'
import nock from 'nock'
import { getPokemonSpeciesByName } from './pokemon-species'

describe('getPokemonSpeciesByName', () => {
  it('gets a pokemon species by name', async () => {
    const pokemonName = 'wormadam'

    nock('https://pokeapi.co/api/v2')
      .get(`/pokemon-species/${pokemonName}`)
      .replyWithFile(200, __dirname + '/pokemon-species-stub.json')

    const species = await getPokemonSpeciesByName(pokemonName)

    expect(species).toMatchObject(
      some({
        id: 413,
        name: pokemonName,
        flavorText:
          'When BURMY evolved, its cloak\nbecame a part of this Pokémon’s\nbody. The cloak is never shed.',
      })
    )
  })
})
