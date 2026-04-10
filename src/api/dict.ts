import request from '@/utils/request'

export interface ListTypeInfoPayload {
  regionList?: unknown[]
}

export interface ListTypeInfoResponse {
  code: number
  data?: ListTypeInfoPayload
  message?: string
}

/** 表单 listTypeInfo：地区等字典（由 vue3-config-ui-api 读库返回） */
export function getListTypeInfo() {
  return request.get('/api/list-type-info') as Promise<ListTypeInfoResponse>
}
