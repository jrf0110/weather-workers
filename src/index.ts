import * as pathToRegExp from 'path-to-regexp'
import { fetchWeather } from './fetch-weather'

type TWeatherRequestParams = { city: string }
const weatherPath = '/weather/:city'

addEventListener('fetch', (event: FetchEvent) => {
  // Create a regular expression based on the pathname of the request
  const weatherPathKeys: pathToRegExp.Key[] = []
  const weatherRegex = pathToRegExp(weatherPath, weatherPathKeys)
  const url = new URL(event.request.url)
  const result = weatherRegex.exec(url.pathname)

  // No result, return early and passthrough
  if (!Array.isArray(result)) return

  // Build the request parameters object
  const params = weatherPathKeys.reduce(
    (params, key, i) => {
      params[key.name as keyof TWeatherRequestParams] = result[i + 1]
      return params
    },
    {} as TWeatherRequestParams,
  )

  event.respondWith(handleWeatherRequest(params))
})

async function handleWeatherRequest(params: TWeatherRequestParams) {
  const weather = await fetchWeather(params.city)
  const body = `
    ${weather.location.city}, ${weather.location.region}<br>
    ${weather.item.condition.temp} ${weather.item.condition.text}
  `.trim()

  return new Response(body, {
    headers: { 'Content-Type': 'text/html' },
  })
}
