/**
 * Fetch the current weather conditions and forecast for a particular location
 * @param location location string to fetch
 * @param unit temperature units (c or f)
 */
export async function fetchWeather(location: string, unit = 'f') {
  const url = `https://query.yahooapis.com/v1/public/yql?q=select *
  from weather.forecast
  where u='${unit}'
    AND woeid in (
      select woeid from geo.places(1)
      where text="${location}"
  )&format=json`
    .split('\n')
    .join(' ')
    // yahoo's api doesn't like spaces unless they're encoded
    .replace(/\s/g, '%20')

  const res = await fetch(url)

  if (res.status >= 400) {
    throw new Error('Bad response from server')
  }

  const result = await res.json()

  return result.query.results && result.query.results.channel
}
