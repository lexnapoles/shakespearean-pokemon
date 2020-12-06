import dotenv from 'dotenv'
import express from 'express'
import { fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { getPokemonSpeciesByName } from './apis/pokemon-api/pokemon-species'
import { getShakespeareanTranslation } from './apis/shakespearean-translator'
import { getShakespeareanPokemonDescription } from './application/get-shakespearean-pokemon-description'
import { ApiError, internalError, toShakespeareanPokemonDescriptionDto } from './common-types'

dotenv.config()

const port = process.env.SERVER_PORT ?? 3000

const app = express()

app.get('/pokemon/:pokemonName', async (req, res) => {
  try {
    const dependencies = {
      getShakespeareanTranslation: getShakespeareanTranslation,
      getPokemonSpeciesByName: getPokemonSpeciesByName,
    }

    const getShakespearianDescriptionWithDependencies = getShakespeareanPokemonDescription(
      dependencies
    )

    const {
      params: { pokemonName },
    } = req

    const description = await getShakespearianDescriptionWithDependencies(pokemonName)

    const errorHandler = (error: ApiError) => {
      switch (error.type) {
        case 'NotFoundError':
          return res.status(404).send(error)
        default:
          res.status(500).send(error)
      }
    }

    pipe(
      description,
      fold(errorHandler, (description) =>
        pipe(toShakespeareanPokemonDescriptionDto(pokemonName, description), res.send)
      )
    )
  } catch (err) {
    res.status(500).send(internalError('Something unexpected happened, please try again later'))
  }
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
