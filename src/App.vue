<template>
  <div class="page">
    <div class="container">
      <CForm
        :model="formData"
        :fields="fields"
        :options="formOptions"
        @submit="onFormSubmit"
      >
        <template #slotDemo="{ model, item }">
          <el-input
            v-model="model[item.prop]"
            clearable
            placeholder="插槽内自定义控件（绑定 model[prop]）"
            style="width: 100%"
          />
        </template>
        <template #regionChildOptions="{ options }">
          <el-option
            v-for="opt in options"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          >
            <span>{{ opt.label }}</span>
            <span class="opt-extra">{{ String(opt.value) }}</span>
          </el-option>
        </template>
        <template #treeDeptNode="{ data }">
          <span>{{ data.label }}</span>
          <span class="tree-node-extra">{{ String(data.value) }}</span>
        </template>
        <!-- P0：labelSlotName 自定义 label -->
        <template #p0LabelSlot="{ item }">
          <span class="p0-label-slot">
            <el-icon><Warning /></el-icon>
            <span>{{ item.label }}</span>
          </span>
        </template>
      </CForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
import type { FormRules } from 'element-plus'
import { getListTypeInfo } from '@/api/dict'
import CForm from './components/form/index.vue'
import type {
  CFormFieldEventContext,
  CFormFieldItem,
  CFormLabelRenderFn,
  CFormOptions,
} from './components/form/types'

/** P0：`labelRender(h, { model, item })`，与 fx-t-ui `labelRender` 一致（此处用纯标签演示，复杂场景可 `h(ElTooltip, …)` 等） */
const p0LabelRender: CFormLabelRenderFn = (h0, { item }) =>
  h0('span', { class: 'p0-label-render' }, [
    h0('span', { class: 'p0-label-render__mark', title: '由 h() 渲染' }, '?'),
    h0('span', null, item.label),
    h0('code', { class: 'p0-label-render__tag' }, 'h()'),
  ])

const formData = reactive<Record<string, unknown>>({
  name: '',
  remark: '',
  age: undefined as number | undefined,
  region: '',
  regionChild: '',
  enabled: true,
  day: '',
  slotDemo: '',
  kind: '',
  tags: [] as string[],
  cascade: [] as unknown[],
  dateRange: [] as unknown[],
  dtRange: [] as unknown[],
  meetAt: '',
  multi: [] as string[],
  treeDept: '',
  treeMulti: [] as string[],
  dynComp: '',
  trimDemo: '  前后有空格  ',
  noTrimDemo: '  保留首尾空格  ',
  labelSlotDemo: '',
  labelRenderDemo: '',
  textShowDemo: '来自 model 的只读值',
  textFormatterDemo: '',
})

const fields: CFormFieldItem[] = [
  {
    prop: 'name',
    label: '名称',
    type: 'input',
    placeholder: '请输入名称',
    bind: { maxlength: 10, showWordLimit: true },
  },
  {
    prop: 'remark',
    label: '备注',
    type: 'textarea',
    rows: 3,
    placeholder: '请输入备注',
    colSpan: 24,
  },
  {
    prop: 'slotDemo',
    label: '插槽示例',
    type: 'input',
    slotName: 'slotDemo',
    colSpan: 24,
  },
  {
    prop: 'trimDemo',
    label: '自动 trim',
    type: 'input',
    placeholder: '失焦或 change 去掉首尾空格（options.isTrim 默认 true）',
    colSpan: 12,
  },
  {
    prop: 'noTrimDemo',
    label: '跳过 trim',
    type: 'input',
    isTrim: true,
    placeholder: '字段 isTrim: true 时不 trim',
    colSpan: 12,
  },
  {
    prop: 'labelSlotDemo',
    label: 'Label 插槽',
    labelSlotName: 'p0LabelSlot',
    type: 'input',
    placeholder: 'label 由 #p0LabelSlot 渲染',
    colSpan: 12,
  },
  {
    prop: 'labelRenderDemo',
    label: 'Label(h) 示例',
    type: 'input',
    labelRender: p0LabelRender,
    placeholder: 'label 由 labelRender 渲染',
    colSpan: 12,
  },
  {
    prop: 'textShowDemo',
    label: 'textShow',
    type: 'input',
    textShow: true,
    colSpan: 8,
  },
  {
    prop: 'textFormatterDemo',
    label: 'textFormatter',
    type: 'input',
    textShow: true,
    textFormatter: (_m, item) => `【${item.label}】自定义文案`,
    colSpan: 8,
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
    list: 'regionList',
    optionLabelKey: 'dictLabel',
    optionValueKey: 'dictValue',
    bind: (m) => ({
      disabled: !String(m.name ?? '').trim(),
    }),
    events: {
      // 这里可以拿到组件内部回传的model和item
      change(_val: unknown, ctx: CFormFieldEventContext) {
        ElMessage.info(`已选地区：${String(ctx.model.region ?? '')}`)
      },
      clear(){
        ElMessage.info('已清空地区')
      }
    },
  },
  {
    prop: 'regionChild',
    label: '地区(子插槽)',
    type: 'select',
    placeholder: '选项内容由子插槽渲染',
    list: 'regionList',
    optionLabelKey: 'dictLabel',
    optionValueKey: 'dictValue',
    childSlotName: 'regionChildOptions',
    colSpan: 24,
  },
  { prop: 'enabled', label: '启用', type: 'switch' },
  {
    prop: 'day',
    label: '日期',
    type: 'date',
    placeholder: '选择日期',
    // 这里的m是传入到组件的formData，里面调用函数的时候又回传出来给m，然后判断是否隐藏
    isHideItem: (m) => m.enabled !== true,
  },
  {
    prop: 'meetAt',
    label: '日期时间',
    type: 'datetime',
    placeholder: '选择日期时间',
  },
  {
    prop: 'dateRange',
    label: '日期范围',
    type: 'daterange',
    colSpan: 8,
  },
  {
    prop: 'dtRange',
    label: '日期时间范围',
    type: 'datetimerange',
    colSpan: 8,
  },
  {
    prop: 'kind',
    label: '单选',
    type: 'radio',
    options: [
      { label: '甲', value: 'a' },
      { label: '乙', value: 'b' },
    ],
    events:{
      change(value:string){
        console.log(value)
      }
    }
  },
  {
    prop: 'tags',
    label: '多选框',
    type: 'checkbox',
    colSpan: 8,
    options: [
      { label: '读', value: 'read' },
      { label: '写', value: 'write' },
    ],
  },
  {
    prop: 'cascade',
    label: '级联',
    type: 'cascader',
    cascaderList: 'cascaderDemo',
    colSpan: 8,
  },
  {
    prop: 'multi',
    label: '下拉多选',
    type: 'select-multiple',
    placeholder: '多选水果',
    options: [
      { label: '苹果', value: 'apple' },
      { label: '梨', value: 'pear' },
      { label: '橙', value: 'orange' },
    ],
    colSpan: 8,
  },
  {
    prop: 'treeDept',
    label: '树形选择',
    type: 'tree-select',
    treeSelectList: 'treeDemo',
    treeSelectSlotName: 'treeDeptNode',
    placeholder: 'el-tree-select，自定义节点插槽',
    colSpan: 12,
  },
  {
    prop: 'treeMulti',
    label: '树形多选',
    type: 'tree-select',
    treeSelectList: 'treeDemo',
    placeholder: '请选择（可多选）',
    bind: { multiple: true },
    colSpan: 12,
  },
  {
    prop: 'dynComp',
    label: '动态组件',
    type: 'component',
    component: 'ElInput',
    placeholder: 'type: component + 全局 ElInput',
    colSpan: 24,
  },
]

const formOptions = reactive<CFormOptions>({
  labelWidth: '88px',
  labelPosition: 'right',
  columns: 3,
  gutter: 16,
  showFooterBtns: true,
  listTypeInfo: {
    regionList: [],
    cascaderDemo: [
      {
        value: 'zhejiang',
        label: '浙江',
        children: [
          { value: 'hangzhou', label: '杭州' },
          { value: 'ningbo', label: '宁波' },
        ],
      },
      {
        value: 'jiangsu',
        label: '江苏',
        children: [{ value: 'nanjing', label: '南京' }],
      },
    ],
    treeDemo: [
      {
        value: '1',
        label: '一级 1',
        children: [
          {
            value: '1-1',
            label: '二级 1-1',
            children: [{ value: '1-1-1', label: '三级 1-1-1' }],
          },
        ],
      },
      {
        value: '2',
        label: '一级 2',
        children: [
          {
            value: '2-1',
            label: '二级 2-1',
            children: [{ value: '2-1-1', label: '三级 2-1-1' }],
          },
          {
            value: '2-2',
            label: '二级 2-2',
            children: [{ value: '2-2-1', label: '三级 2-2-1' }],
          },
        ],
      },
    ],
  },
  rules: {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    region: [{ required: true, message: '请选择地区', trigger: 'change' }],
  } satisfies FormRules,
})

async function loadListTypeInfoFromApi() {
  try {
    const res = await getListTypeInfo()
    if (res.code === 200 && res.data && Array.isArray(res.data.regionList)) {
      formOptions.listTypeInfo = {
        ...formOptions.listTypeInfo,
        regionList: res.data.regionList,
      }
      return
    }
    ElMessage.warning(res.message ?? '字典接口返回异常，地区列表为空')
  } catch {
    ElMessage.error('无法连接字典接口：请启动独立项目 vue3-config-ui-api 并配置 MySQL')
  }
}

onMounted(() => {
  void loadListTypeInfoFromApi()
})

function onFormSubmit(model: Record<string, unknown>) {
  ElMessage.success(JSON.stringify(model))
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

.opt-extra {
  float: right;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.tree-node-extra {
  margin-left: 6px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.p0-label-slot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.p0-label-render {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.p0-label-render__mark {
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--el-color-info-light-9);
  color: var(--el-color-primary);
  font-size: 12px;
  font-weight: 600;
  cursor: help;
}

.p0-label-render__tag {
  margin-left: 2px;
  font-size: 11px;
  color: var(--el-color-primary);
}
</style>
