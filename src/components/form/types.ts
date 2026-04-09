/**
 * CForm 配置类型（按步扩展）
 */

import type { FormItemRule, FormRules } from 'element-plus'

/** 当前支持的表单项类型（后续可继续加） */
export type CFormFieldType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'select'
  | 'switch'
  | 'date'

export interface CFormSelectOption {
  label: string
  value: string | number | boolean
}

export interface CFormFieldItem {
  /** 对应 el-form-item 的 prop，与 model 的 key 一致 */
  prop: string
  label: string
  type: CFormFieldType
  /** type 为 select 时下拉选项 */
  options?: CFormSelectOption[]
  placeholder?: string
  /** type 为 textarea 时行数 */
  rows?: number
  /**
   * 占栅格列数（1–24），与 Element Plus `el-col` 的 span 一致。
   * 不设时按 `options.columns` 均分一行（24 / columns）。
   */
  colSpan?: number
  /** 该项校验规则，对应 `el-form-item` 的 rules，可与表单级 rules 叠加 */
  rules?: FormItemRule | FormItemRule[]
}

/** 表单级：布局等，与 el-form 对齐的字段先放这里 */
export interface CFormOptions {
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  /** 每行展示几个表单项；默认 1（整行一个） */
  columns?: number
  /** `el-row` 栅格间隔（px），默认 16 */
  gutter?: number
  /** 表单级校验规则，key 与 `model` 字段名一致，对应 `el-form` 的 rules */
  rules?: FormRules
}

export interface CFormProps {
  /** 表单数据，对应 el-form 的 model */
  model: Record<string, unknown>
  /** 表单项配置，顺序即展示顺序 */
  fields: CFormFieldItem[]
  /** 可选；不传则用 el-form 默认行为 */
  options?: CFormOptions
}
