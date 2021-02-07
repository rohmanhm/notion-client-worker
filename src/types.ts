import * as notion from 'notion-types'
import { Params } from 'tiny-request-router'

export type JSONData =
  | null
  | boolean
  | number
  | string
  | JSONData[]
  | { [prop: string]: JSONData }

export interface HandlerRequest {
  params: Params
  searchParams: URLSearchParams
  request: Request
}

export interface SignedUrlRequest {
  permissionRecord: PermissionRecord
  url: string
}

export interface PermissionRecord {
  table: string
  id: notion.ID
}

export interface SignedUrlResponse {
  signedUrls: string[]
}
