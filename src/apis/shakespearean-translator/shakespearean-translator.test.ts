import { left, right } from 'fp-ts/lib/Either'
import nock from 'nock'
import { getShakespeareanTranslation } from '.'
import { internalError } from '../../common-types'

describe('getShakespeareanTranslation', () => {
  it('translates the text to a shakespeare version', async () => {
    const originalText =
      'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally'

    const stub = {
      success: {
        total: 1,
      },
      contents: {
        translated:
          'Spits fire yond is hot enow to melt boulders. Known to cause forest fires unintentionally',
        text:
          'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally',
        translation: 'shakespeare',
      },
    }

    nock('https://api.funtranslations.com')
      .get('/translate/shakespeare.json')
      .query({ text: originalText })
      .reply(200, stub)

    const lazyGetTranslation = getShakespeareanTranslation(originalText)

    const translatedText = await lazyGetTranslation()

    expect(translatedText).toMatchObject(right(stub.contents.translated))
  })

  it('returns an error string if translation text errors', async () => {
    const originalText =
      'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally'

    nock('https://api.funtranslations.com')
      .get('/translate/shakespeare.json')
      .query({ text: originalText })
      .reply(404)

    const lazyGetTranslation = getShakespeareanTranslation(originalText)

    const translatedText = await lazyGetTranslation()

    expect(translatedText).toMatchObject(
      left(internalError('Translation was not possible at the moment'))
    )
  })

  it('returns an error string if translation response if invalid', async () => {
    const originalText =
      'Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally'

    const stub = {
      success: {
        total: 2,
      },
      contents: {
        translated:
          'Spits fire yond is hot enow to melt boulders. Known to cause forest fires unintentionally',
        text: 'Salamandra',
        translation: 'spanish',
      },
    }

    nock('https://api.funtranslations.com')
      .get('/translate/shakespeare.json')
      .query({ text: originalText })
      .reply(200, stub)

    const lazyGetTranslation = getShakespeareanTranslation(originalText)

    const translatedText = await lazyGetTranslation()

    expect(translatedText).toMatchObject(
      left(internalError('Translation was not possible at the moment'))
    )
  })
})
