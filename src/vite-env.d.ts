/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 留空则走相对路径，开发时配合 Vite proxy；打包直连后端时可设为完整 origin */
  readonly VITE_API_BASE_URL?: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}
