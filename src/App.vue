<template>
  <div class="page">
    <div class="container">
      <CForm ref="formRef" :form-data="formData" :form-opts="formOpts" />
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
import CForm from './components/form/index.vue'
import type { CFormOpts } from './components/form/types'

const formRef = ref<InstanceType<typeof CForm> | null>(null)

const formData = reactive<Record<string, unknown>>({
  name: '',
  remark: '',
  age: undefined as number | undefined,
  region: '',
  enabled: true,
  day: '',
})

const formOpts = reactive<CFormOpts>({
  labelWidth: '88px',
  columns: 3,
  rules: {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    region: [{ required: true, message: '请选择地区', trigger: 'change' }],
  },
  listTypeInfo: {
    regionList: [
      { dictLabel: '华东', dictValue: 'east' },
      { dictLabel: '华北', dictValue: 'north' },
    ],
  },
  fieldList: [
    { prop: 'name', label: '名称', type: 'input' },
    { prop: 'remark', label: '备注', type: 'textarea', colSpan: 24, bind: { rows: 3 } },
    { prop: 'age', label: '年龄', type: 'number' },
    {
      prop: 'region',
      label: '地区',
      type: 'select',
      list: 'regionList',
    },
    {
      prop: 'enabled',
      label: '启用',
      type: 'switch',
    },
    { prop: 'day', label: '日期', type: 'date' },
  ],
})

async function onSubmit() {
  const ok = await formRef.value?.validate()
  if (ok) ElMessage.success(JSON.stringify(formData))
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
