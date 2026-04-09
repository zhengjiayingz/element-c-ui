<template>
  <div class="page">
    <div class="container">
      <CForm ref="formRef" :model="formData" :fields="fields" :options="formOptions" />
      <div class="actions">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="onReset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormRules } from 'element-plus'
import CForm from './components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from './components/form/types'

const formRef = ref<InstanceType<typeof CForm> | null>(null)

const formData = reactive<Record<string, unknown>>({
  name: '',
  remark: '',
  age: undefined as number | undefined,
  region: '',
  enabled: true,
  day: '',
})

const fields: CFormFieldItem[] = [
  { prop: 'name', label: '名称', type: 'input', placeholder: '请输入名称' },
  {
    prop: 'remark',
    label: '备注',
    type: 'textarea',
    rows: 3,
    placeholder: '请输入备注',
    colSpan: 24,
  },
  {
    prop: 'age',
    label: '年龄',
    type: 'number',
    placeholder: '年龄',
    rules: [
      { type: 'number', min: 0, max: 150, message: '年龄 0–150', trigger: 'blur' },
    ],
  },
  {
    prop: 'region',
    label: '地区',
    type: 'select',
    placeholder: '请选择地区',
    options: [
      { label: '华东', value: 'east' },
      { label: '华北', value: 'north' },
    ],
  },
  { prop: 'enabled', label: '启用', type: 'switch' },
  { prop: 'day', label: '日期', type: 'date', placeholder: '选择日期' },
]

const formOptions: CFormOptions = {
  labelWidth: '88px',
  labelPosition: 'right',
  columns: 3,
  gutter: 16,
  rules: {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    region: [{ required: true, message: '请选择地区', trigger: 'change' }],
  } satisfies FormRules,
}

async function onSubmit() {
  try {
    await formRef.value?.validate()
    ElMessage.success(JSON.stringify(formData))
  } catch {
    /* el-form 校验未通过 */
  }
}

function onReset() {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding: 24px 16px;
  box-sizing: border-box;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
}

.actions {
  margin-top: 8px;
  display: flex;
  gap: 12px;
}
</style>
