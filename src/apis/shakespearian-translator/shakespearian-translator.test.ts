import nock from 'nock'
import { getShakespearianTranslation } from '.'

describe('getShakespearianTranslation', () => {
  it('translates the text to a shakespeare version', async () => {
    const originalText =
      'Spits fire that is hot enough to melt boulders.Known to cause forest fires unintentionally'

    const stub = {
      success: {
        total: 1,
      },
      contents: {
        translated:
          'Spits fire yond is hot enow to melt boulders. Known to cause forest fires unintentionally',
        text:
          'Spits fire that is hot enough to melt boulders.Known to cause forest fires unintentionally',
        translation: 'shakespeare',
      },
    }

    nock('https://api.funtranslations.com')
      .get('/translate/shakespeare.json')
      .query({ text: originalText })
      .reply(200, stub)

    const translatedText = await getShakespearianTranslation(originalText)

    expect(translatedText).toBe(stub.contents.translated)
  })
})
