import { HandlerRequest } from './types'
import { NotionAPI } from './notion-client'
import { createResponse } from './response'

const notion = new NotionAPI()

export async function pageRoute(req: HandlerRequest) {
  const { pageId } = req.params
  if (pageId) {
    const data = await notion.getPage(pageId)
    return createResponse(data, {}, 200)
  }

  return createResponse({ message: 'No pageId param specified.' }, {}, 400)
}
