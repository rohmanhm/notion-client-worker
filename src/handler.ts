import { Method, Router } from 'tiny-request-router'
import * as types from './types'
import { getCacheKey } from './get-cache-key'
import { createResponse } from './response'
import { pageRoute } from './routes'

export type Handler = (
  req: types.HandlerRequest,
) => Promise<Response> | Response

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
}

const router = new Router<Handler>()

router.options('*', () => new Response(null, { headers: corsHeaders }))
router.get('/v1/page/:pageId', pageRoute)
router.get('*', async () =>
  createResponse({ error: `Route not found!` }, {}, 404),
)

const cache = caches.default
export async function handleRequest(fetchEvent: FetchEvent): Promise<Response> {
  const { request } = fetchEvent
  const { pathname, searchParams } = new URL(request.url)
  const match = router.match(request.method as Method, pathname)

  if (!match) {
    return new Response('Endpoint not found.', { status: 404 })
  }

  const cacheKey = getCacheKey(request)
  let response

  if (cacheKey) {
    try {
      response = await cache.match(cacheKey)
    } catch (err) {}
  }

  const getResponseAndPersist = async () => {
    const res = await match.handler({
      request,
      searchParams,
      params: match.params,
    })

    if (cacheKey) {
      await cache.put(cacheKey, res.clone())
    }

    return res
  }

  if (response) {
    fetchEvent.waitUntil(getResponseAndPersist())
    return response
  }

  return getResponseAndPersist()
}
