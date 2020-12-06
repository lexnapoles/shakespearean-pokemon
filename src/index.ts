import dotenv from 'dotenv'
import express from 'express'
import { fold } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { getPokemonSpeciesByName } from './apis/pokemon-api/pokemon-species'
import { getShakespearianTranslation } from './apis/shakespearian-translator'
import { ApiError, internalError } from './error'
import { getShakespearianPokemonDescription } from './application/get-shakespearian-pokemon-description'

dotenv.config()

const port = process.env.SERVER_PORT ?? 3000

const app = express()

app.get('/pokemon/:pokemonName', async (req, res) => {
  try {
    const dependencies = {
      getShakespearianTranslation: getShakespearianTranslation,
      getPokemonSpeciesByName: getPokemonSpeciesByName,
    }

    const getShakespearianDescriptionWithDependencies = getShakespearianPokemonDescription(
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
      fold(errorHandler, (description) => res.send(description))
    )
  } catch (err) {
    res.status(500).send(internalError('Something unexpected happened, please try again later'))
  }
})

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
