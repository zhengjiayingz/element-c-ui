import type { FormItemRule, FormRules } from 'element-plus'

/** 与 el-form-item 一致；也可写 t-ui 的 `value` 表示同一字段 */
export interface CFormField {
  prop?: string
  value?: string
  label: string
  /** 控件类型，默认 input */
  type?:
    | 'input'
    | 'textarea'
    | 'number'
    | 'select'
    | 'switch'
    | 'date'
  placeholder?: string
  /** 下拉选项，或与 listTypeInfo + list 二选一 */
  options?: Array<{ label: string; value: string | number | boolean }>
  /** 对应 formOpts.listTypeInfo 的 key（t-ui 风格） */
  list?: string
  /** 字典字段名，默认 dictLabel / dictValue */
  arrLabel?: string
  arrKey?: string
  /** 透传给内部 Element 组件 */
  bind?: Record<string, unknown>
  /**
   * 栅格列占位 1–24，默认按 `formOpts.columns` 均分（如 3 列则默认 8）
   * 需要整行时可设 24（如长文本）
   */
  colSpan?: number
  hidden?: boolean | ((data: Record<string, unknown>) => boolean)
  rules?: FormItemRule | FormItemRule[]
}

export interface CFormOpts {
  fieldList: CFormField[]
  rules?: FormRules
  labelWidth?: string
  labelPosition?: 'left' | 'right' | 'top'
  /** 每行表单项列数，默认 3（24 栅格均分） */
  columns?: number
  /** t-ui 风格：select 选项字典 */
  listTypeInfo?: Record<
    string,
    Array<Record<string, string | number | boolean | undefined>>
  >
}
