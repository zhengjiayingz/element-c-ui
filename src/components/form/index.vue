<template>
  <el-form
    ref="innerFormRef"
    class="c-form"
    :model="formModel"
    :rules="formRules"
    :label-width="labelWidth"
    :label-position="labelPosition"
  >
    <el-row :gutter="rowGutter">
      <el-col
        v-for="item in fields"
        :key="item.prop"
        :span="spanFor(item)"
      >
        <el-form-item
          :label="item.label"
          :prop="item.prop"
          :rules="item.rules"
        >
          <template v-if="item.type === 'input'">
            <el-input
              v-model="formModel[item.prop]"
              :placeholder="item.placeholder"
              clearable
              style="width: 100%"
            />
          </template>
          <template v-else-if="item.type === 'textarea'">
            <el-input
              v-model="formModel[item.prop]"
              type="textarea"
              :rows="item.rows ?? 3"
              :placeholder="item.placeholder"
              style="width: 100%"
            />
          </template>
          <template v-else-if="item.type === 'number'">
            <el-input-number
              v-model="formModel[item.prop] as number | undefined"
              :placeholder="item.placeholder"
              style="width: 100%"
            />
          </template>
          <template v-else-if="item.type === 'select'">
            <el-select
              v-model="formModel[item.prop]"
              :placeholder="item.placeholder"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="opt in item.options ?? []"
                :key="String(opt.value)"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </template>
          <template v-else-if="item.type === 'switch'">
            <el-switch v-model="formModel[item.prop] as boolean" />
          </template>
          <template v-else-if="item.type === 'date'">
            <el-date-picker
              v-model="formModel[item.prop]"
              type="date"
              value-format="YYYY-MM-DD"
              :placeholder="item.placeholder ?? '选择日期'"
              style="width: 100%"
            />
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import type { FormInstance } from 'element-plus'
import type { CFormProps } from './types'

defineOptions({ name: 'CForm' })

const props = withDefaults(defineProps<CFormProps>(), {
  options: undefined
})

const fields = computed(() => props.fields)

/** 与父组件 :model 传入对象为同一引用，供 el-form 校验 / resetFields 使用 */
const formModel = toRef(props, 'model')

const innerFormRef = ref<FormInstance>()

const labelWidth = computed(() => props.options?.labelWidth)
const labelPosition = computed(() => props.options?.labelPosition ?? 'right')

const formRules = computed(() => props.options?.rules)

const rowGutter = computed(() => props.options?.gutter ?? 16)

/** 每行表单项数量，至少为 1 */
const columns = computed(() => {
  const n = props.options?.columns ?? 1
  return n >= 1 ? n : 1
})

/** 未指定 colSpan 时，按 columns 均分 24 栅格 */
const defaultColSpan = computed(() => Math.floor(24 / columns.value) || 24)

function spanFor(item: (typeof props.fields)[number]) {
  if (item.colSpan != null) {
    return Math.min(24, Math.max(1, item.colSpan))
  }
  return defaultColSpan.value
}

defineExpose({
  validate: (callback?: Parameters<FormInstance['validate']>[0]) =>
    innerFormRef.value?.validate(callback),
  resetFields: () => innerFormRef.value?.resetFields(),
  clearValidate: (propsArg?: string | string[]) =>
    innerFormRef.value?.clearValidate(propsArg),
})
</script>

<style lang="scss" scoped>
.c-form {
  width: 100%;
}
</style>
