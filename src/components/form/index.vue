<template>
  <el-form
    ref="formRef"
    class="c-form"
    :model="formData"
    :rules="mergedRules"
    :label-width="formOpts.labelWidth ?? '100px'"
    :label-position="formOpts.labelPosition ?? 'right'"
  >
    <el-row :gutter="rowGutter">
      <el-col
        v-for="field in visibleFields"
        :key="fieldKey(field)"
        :span="colSpanOf(field)"
      >
        <el-form-item
          :label="field.label"
          :prop="fieldKey(field)"
          :rules="field.rules"
        >
      <template v-if="field.type === 'textarea'">
        <el-input
          v-model="formData[fieldKey(field)]"
          type="textarea"
          :placeholder="placeholderOf(field)"
          v-bind="field.bind"
        />
      </template>

      <template v-else-if="field.type === 'number'">
        <el-input-number
          v-model="formData[fieldKey(field)]"
          :placeholder="placeholderOf(field)"
          style="width: 100%"
          v-bind="field.bind"
        />
      </template>

      <template v-else-if="field.type === 'select'">
        <el-select
          v-model="formData[fieldKey(field)]"
          :placeholder="placeholderOf(field)"
          style="width: 100%"
          clearable
          v-bind="field.bind"
        >
          <el-option
            v-for="(opt, i) in optionsOf(field)"
            :key="i"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </template>

      <template v-else-if="field.type === 'switch'">
        <el-switch v-model="formData[fieldKey(field)]" v-bind="field.bind" />
      </template>

      <template v-else-if="field.type === 'date'">
        <el-date-picker
          v-model="formData[fieldKey(field)]"
          type="date"
          :placeholder="placeholderOf(field)"
          style="width: 100%"
          value-format="YYYY-MM-DD"
          v-bind="field.bind"
        />
      </template>

      <template v-else>
        <el-input
          v-model="formData[fieldKey(field)]"
          :placeholder="placeholderOf(field)"
          v-bind="field.bind"
        />
      </template>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { CFormField, CFormOpts } from './types'

defineOptions({ name: 'CForm' })

const props = defineProps<{
  /** 表单数据，请传入 reactive / ref 对象，便于双向绑定 */
  formData: Record<string, unknown>
  formOpts: CFormOpts
}>()

const formRef = ref<FormInstance>()

const mergedRules = computed<FormRules | undefined>(() => props.formOpts.rules)

const rowGutter = 16

const baseColSpan = computed(() => {
  const cols = props.formOpts.columns ?? 3
  const c = Math.min(24, Math.max(1, cols))
  return Math.floor(24 / c)
})

function colSpanOf(f: CFormField): number {
  if (f.colSpan != null) {
    return Math.min(24, Math.max(1, f.colSpan))
  }
  return baseColSpan.value
}

function fieldKey(f: CFormField): string {
  const k = f.prop ?? f.value
  return k ?? ''
}

const visibleFields = computed(() => {
  const list = props.formOpts.fieldList ?? []
  return list.filter((f) => {
    const k = fieldKey(f)
    if (!k) return false
    const h = f.hidden
    if (typeof h === 'function') return !h(props.formData)
    return !h
  })
})

function placeholderOf(f: CFormField): string {
  if (f.placeholder) return f.placeholder
  const t = f.type ?? 'input'
  if (t === 'select' || t === 'date') return `请选择${f.label}`
  return `请输入${f.label}`
}

function optionsOf(f: CFormField): Array<{ label: string; value: string | number | boolean }> {
  if (f.options?.length) return f.options
  const listKey = f.list
  if (!listKey || !props.formOpts.listTypeInfo?.[listKey]) return []
  const raw = props.formOpts.listTypeInfo[listKey]
  const lk = f.arrLabel ?? 'dictLabel'
  const vk = f.arrKey ?? 'dictValue'
  return raw.map((row) => ({
    label: String(row[lk] ?? ''),
    value: row[vk] as string | number | boolean,
  }))
}

async function validate(): Promise<boolean> {
  if (!formRef.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

function resetFields(): void {
  formRef.value?.resetFields()
}

function clearValidate(propsArg?: string | string[]): void {
  formRef.value?.clearValidate(propsArg)
}

defineExpose({ validate, resetFields, clearValidate, formRef })
</script>

<style lang="scss" scoped>
.c-form {
  width: 100%;
}

.c-form :deep(.el-form-item) {
  margin-bottom: 18px;
}
</style>
