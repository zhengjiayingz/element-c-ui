import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

/** 与 e2e-web-client-webpack5 `util/axios` 类似：实例 + 拦截器；此处为 Vue3 演示版，无 Loading / 国际化 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 30_000,
  withCredentials: false,
})

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // 避免 GET 被缓存（对齐老项目 util/axios）
  if (String(config.method).toLowerCase() === 'get') {
    config.params = { ...config.params, t: Date.now() }
  }
  return config
})

request.interceptors.response.use(
  (res) => {
    if (res.config.responseType === 'arraybuffer' || res.config.responseType === 'blob') {
      return res
    }
    return res.data
  },
  (err: AxiosError) => Promise.reject(err)
)

export default request
