export type GetShakespearianTranslation = (text: string) => Promise<string>

export const getShakespearianTranslation: GetShakespearianTranslation = (text) => {
  return Promise.resolve(text)
}
