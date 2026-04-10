# CForm

通过配置 `model`、`fields`、`options` 渲染 **Element Plus** 表单（内部为 `el-form` + `el-row` / `el-col`）。行为与属性命名尽量与 [Form 表单](https://element-plus.org/zh-CN/component/form) 及各类表单子组件文档对齐；额外能力通过字段上的 `bind` 透传，用法同对应 EP 组件的 **Attributes**。

**源码**：`src/components/form/index.vue` · **类型**：`src/components/form/types.ts`

---

## 基础用法

最简单的单字段 + 内置提交按钮：`model` 与业务对象是**同一引用**，提交时拿到的是当前表单数据。

```vue
<template>
  <CForm
    :model="formData"
    :fields="fields"
    :options="formOptions"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { FormRules } from 'element-plus'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ title: '' })

const fields: CFormFieldItem[] = [
  { prop: 'title', label: '标题', type: 'input', placeholder: '请输入标题' },
]

const formOptions: CFormOptions = {
  labelWidth: '100px',
  showFooterBtns: true,
  rules: {
    title: [{ required: true, message: '必填', trigger: 'blur' }],
  } satisfies FormRules,
}

function onSubmit(model: Record<string, unknown>) {
  console.log('submit', model)
}
</script>
```

---

## CForm Attributes

| 属性    | 说明 |
|---------|------|
| `model` | 表单数据对象，对应 `el-form` 的 `model`，字段 `prop` 与 `model` 的 key 一致 |
| `fields` | 表单项配置数组，顺序即展示顺序 |
| `options` | 可选，表单级布局、校验、字典、底部区域等，见下文 **CFormOptions** |

---

## CFormOptions 表单级配置

### labelWidth / labelPosition

与 [Form#attributes](https://element-plus.org/zh-CN/component/form#form-attributes) 中 `label-width`、`label-position` 一致。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ a: '' })
const fields: CFormFieldItem[] = [
  { prop: 'a', label: '字段', type: 'input' },
]
const formOptions: CFormOptions = {
  labelWidth: '120px',
  labelPosition: 'top',
}
</script>

<template>
  <CForm :model="formData" :fields="fields" :options="formOptions" />
</template>
```

### columns / gutter（栅格列数与间距）

一行展示多个表单项时用 `columns`（将 24 栅格均分）；`gutter` 为 `el-row` 间距，默认 `16`。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ x: '', y: '', z: '' })
const fields: CFormFieldItem[] = [
  { prop: 'x', label: '甲', type: 'input' },
  { prop: 'y', label: '乙', type: 'input' },
  { prop: 'z', label: '丙', type: 'input' },
]
const formOptions: CFormOptions = {
  labelWidth: '80px',
  columns: 3,
  gutter: 20,
}
</script>

<template>
  <CForm :model="formData" :fields="fields" :options="formOptions" />
</template>
```

### rules（表单级校验）

与 [Form#表单校验](https://element-plus.org/zh-CN/component/form#表单校验) 相同，`rules` 的 key 与 `model` 字段名一致；可与字段上的 `rules` 叠加。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import type { FormRules } from 'element-plus'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ email: '' })
const fields: CFormFieldItem[] = [
  { prop: 'email', label: '邮箱', type: 'input', placeholder: 'name@example.com' },
]
const formOptions: CFormOptions = {
  labelWidth: '88px',
  rules: {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '格式不正确', trigger: 'blur' },
    ],
  } satisfies FormRules,
}
</script>

<template>
  <CForm :model="formData" :fields="fields" :options="formOptions" />
</template>
```

### listTypeInfo（字典数据）

供字段上的 `list` / `cascaderList` / `treeSelectList` 引用；配合 `optionLabelKey` / `optionValueKey` 映射行数据，见下节 **list 与字典**。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ city: '' })
const fields: CFormFieldItem[] = [
  {
    prop: 'city',
    label: '城市',
    type: 'select',
    list: 'cityList',
    optionLabelKey: 'name',
    optionValueKey: 'code',
  },
]
const formOptions: CFormOptions = {
  labelWidth: '88px',
  listTypeInfo: {
    cityList: [
      { name: '杭州', code: 'hz' },
      { name: '上海', code: 'sh' },
    ],
  },
}
</script>

<template>
  <CForm :model="formData" :fields="fields" :options="formOptions" />
</template>
```

---

## 字段配置 CFormFieldItem

### prop / label / placeholder

`prop` 必须存在于 `model` 中（可先 `reactive` 定义好 key）。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ name: '' })
const fields: CFormFieldItem[] = [
  {
    prop: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '请输入姓名',
  },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

### colSpan（单项占列宽）

覆盖当行的均分宽度，取值为 `1–24`，与 [Layout 布局#col](https://element-plus.org/zh-CN/component/layout#col-attributes) 的 `span` 一致。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ short: '', long: '' })
const fields: CFormFieldItem[] = [
  { prop: 'short', label: '短', type: 'input', colSpan: 8 },
  { prop: 'long', label: '长', type: 'input', colSpan: 16 },
]
const formOptions: CFormOptions = { labelWidth: '80px', columns: 2 }
</script>

<template>
  <CForm :model="formData" :fields="fields" :options="formOptions" />
</template>
```

### 字段级 rules

与 [FormItem](https://element-plus.org/zh-CN/component/form#formitem-attributes) 的 `rules` 一致。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ age: undefined as number | undefined })
const fields: CFormFieldItem[] = [
  {
    prop: 'age',
    label: '年龄',
    type: 'number',
    rules: [{ type: 'number', min: 0, max: 120, message: '0–120', trigger: 'blur' }],
  },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

---

## 输入类控件

### type: input

对应 [Input 输入框](https://element-plus.org/zh-CN/component/input)；默认 `clearable`，更多属性用 `bind`。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ code: '' })
const fields: CFormFieldItem[] = [
  {
    prop: 'code',
    label: '编码',
    type: 'input',
    bind: { maxlength: 8, showWordLimit: true },
  },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

### type: textarea

对应 `el-input` 的 `type="textarea"`；`rows` 默认 `3`。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ desc: '' })
const fields: CFormFieldItem[] = [
  { prop: 'desc', label: '说明', type: 'textarea', rows: 4, placeholder: '多行文本' },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

### type: number

对应 [Input Number](https://element-plus.org/zh-CN/component/input-number)。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ qty: 1 as number | undefined })
const fields: CFormFieldItem[] = [
  { prop: 'qty', label: '数量', type: 'number', bind: { min: 0, max: 99 } },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

---

## 选择类控件

### type: select（options 本地选项）

对应 [Select 选择器](https://element-plus.org/zh-CN/component/select)；默认 `clearable`、`filterable`。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ fruit: '' })
const fields: CFormFieldItem[] = [
  {
    prop: 'fruit',
    label: '水果',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '苹果', value: 'apple' },
      { label: '香蕉', value: 'banana' },
    ],
  },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

### list 与 listTypeInfo（远程/字典选项）

字典数组非空时优先于字段 `options`；常用 `dictLabel` / `dictValue` 映射。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ region: '' })
const fields: CFormFieldItem[] = [
  {
    prop: 'region',
    label: '地区',
    type: 'select',
    list: 'regionList',
    optionLabelKey: 'dictLabel',
    optionValueKey: 'dictValue',
  },
]
const formOptions: CFormOptions = {
  labelWidth: '88px',
  listTypeInfo: {
    regionList: [
      { dictLabel: '华东', dictValue: 'e' },
      { dictLabel: '华北', dictValue: 'n' },
    ],
  },
}
</script>

<template>
  <CForm :model="formData" :fields="fields" :options="formOptions" />
</template>
```

### type: select-multiple

等价于 `el-select` 设置 `multiple: true`；`model[prop]` 一般为数组。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ tags: [] as string[] })
const fields: CFormFieldItem[] = [
  {
    prop: 'tags',
    label: '标签',
    type: 'select-multiple',
    options: [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' },
    ],
    bind: { collapseTags: true, maxCollapseTags: 2, collapseTagsTooltip: true },
  },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

### childSlotName（自定义下拉选项）

仅 `select` / `select-multiple`；在 `el-select` 内替换默认 `el-option`，作用域含 `options`（与内置数据源一致）。写法可参考 [Select#自定义模板](https://element-plus.org/zh-CN/component/select#自定义模板) 思路。

```vue
<template>
  <CForm :model="formData" :fields="fields">
    <template #myOptions="{ options }">
      <el-option
        v-for="opt in options"
        :key="String(opt.value)"
        :label="opt.label"
        :value="opt.value"
      >
        <span>{{ opt.label }}</span>
        <span style="margin-left: 8px; color: var(--el-text-color-secondary)">
          {{ opt.value }}
        </span>
      </el-option>
    </template>
  </CForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ x: '' })
const fields: CFormFieldItem[] = [
  {
    prop: 'x',
    label: '自定义选项',
    type: 'select',
    childSlotName: 'myOptions',
    options: [
      { label: '选项一', value: '1' },
      { label: '选项二', value: '2' },
    ],
  },
]
</script>
```

### type: radio / checkbox

选项来源与 `select` 相同（`options` 或 `list` + `listTypeInfo`）。`checkbox` 的 `model[prop]` 一般为数组。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({
  mode: 'a',
  perm: [] as string[],
})
const fields: CFormFieldItem[] = [
  {
    prop: 'mode',
    label: '模式',
    type: 'radio',
    options: [
      { label: '甲', value: 'a' },
      { label: '乙', value: 'b' },
    ],
  },
  {
    prop: 'perm',
    label: '权限',
    type: 'checkbox',
    options: [
      { label: '读', value: 'r' },
      { label: '写', value: 'w' },
    ],
  },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

### type: switch

对应 [Switch 开关](https://element-plus.org/zh-CN/component/switch)。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ on: true })
const fields: CFormFieldItem[] = [{ prop: 'on', label: '启用', type: 'switch' }]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

---

## 日期与时间

与 [DatePicker 日期选择器](https://element-plus.org/zh-CN/component/date-picker) 对齐；未在 `bind` 中指定 `value-format` 时，内置默认格式如下：

| type           | 默认 value-format        |
|----------------|---------------------------|
| `date`         | `YYYY-MM-DD`              |
| `datetime`     | `YYYY-MM-DD HH:mm:ss`     |
| `daterange`    | `YYYY-MM-DD`              |
| `datetimerange`| `YYYY-MM-DD HH:mm:ss`     |

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({
  d: '',
  dt: '',
  dr: [] as unknown[],
})
const fields: CFormFieldItem[] = [
  { prop: 'd', label: '日期', type: 'date' },
  { prop: 'dt', label: '日期时间', type: 'datetime' },
  { prop: 'dr', label: '范围', type: 'daterange' },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

---

## 级联 Cascader

对应 [Cascader 级联选择器](https://element-plus.org/zh-CN/component/cascader)。数据在 **`options`** 上：优先 `cascaderList` → `listTypeInfo`，否则 `bind.options`。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ area: [] as unknown[] })
const fields: CFormFieldItem[] = [
  {
    prop: 'area',
    label: '地区',
    type: 'cascader',
    cascaderList: 'areaTree',
  },
]
const formOptions: CFormOptions = {
  labelWidth: '88px',
  listTypeInfo: {
    areaTree: [
      {
        value: 'zj',
        label: '浙江',
        children: [
          { value: 'hz', label: '杭州' },
          { value: 'nb', label: '宁波' },
        ],
      },
    ],
  },
}
</script>

<template>
  <CForm :model="formData" :fields="fields" :options="formOptions" />
</template>
```

---

## 树形选择 TreeSelect

对应 [TreeSelect 树形选择](https://element-plus.org/zh-CN/component/tree-select)。数据在 **`data`** 上（不是 `options`）：优先 `treeSelectList` → `listTypeInfo`，否则 `bind.data`。多选使用 `bind.multiple`。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ dept: '' })
const fields: CFormFieldItem[] = [
  {
    prop: 'dept',
    label: '部门',
    type: 'tree-select',
    treeSelectList: 'deptTree',
  },
]
const formOptions: CFormOptions = {
  labelWidth: '88px',
  listTypeInfo: {
    deptTree: [
      {
        value: '1',
        label: '总部',
        children: [{ value: '1-1', label: '研发' }],
      },
    ],
  },
}
</script>

<template>
  <CForm :model="formData" :fields="fields" :options="formOptions" />
</template>
```

### treeSelectSlotName（自定义节点）

与 Tree 默认插槽一致，作用域含 `data`、`node` 等。

```vue
<template>
  <CForm :model="formData" :fields="fields">
    <template #treeNode="{ data }">
      <span>{{ data.label }}</span>
      <span style="color: var(--el-text-color-secondary)">({{ data.value }})</span>
    </template>
  </CForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ id: '' })
const fields: CFormFieldItem[] = [
  {
    prop: 'id',
    label: '树',
    type: 'tree-select',
    treeSelectList: 't',
    treeSelectSlotName: 'treeNode',
  },
]
const formOptions: CFormOptions = {
  listTypeInfo: {
    t: [{ value: 'a', label: '节点A' }],
  },
}
</script>
```

---

## 动态组件 type: component

`<component :is="component" v-model="model[prop]">`，用于 EP 未单独封装 `type` 的组件或业务组件（如表格选择）。`component` 可为 **`markRaw(组件)`** 或全局注册名字符串（如 **`'ElInput'`**）。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ x: '' })
const fields: CFormFieldItem[] = [
  {
    prop: 'x',
    label: '动态',
    type: 'component',
    component: 'ElInput',
    placeholder: '等同 input',
  },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

---

## bind（透传与联动）

`bind` 为对象或 `(model) => 对象`，合并到具体控件；与对应 EP 组件 **Attributes** 一致。后者适合按表单值禁用等场景。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ name: '', sub: '' })
const fields: CFormFieldItem[] = [
  { prop: 'name', label: '名称', type: 'input', placeholder: '先填名称' },
  {
    prop: 'sub',
    label: '子项',
    type: 'select',
    placeholder: '依赖名称',
    options: [{ label: '一', value: '1' }],
    bind: (m) => ({
      disabled: !String(m.name ?? '').trim(),
    }),
  },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

---

## events（字段事件）

`events` 的 key 与控件 **emits** 名一致（如 `change`、`blur`、`clear`）。调用顺序：**`handler(...组件参数, { model, item })`**，最后一项固定为上下文。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormFieldEventContext } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ city: '' })
const fields: CFormFieldItem[] = [
  {
    prop: 'city',
    label: '城市',
    type: 'select',
    options: [{ label: '杭州', value: 'hz' }],
    events: {
      change(_val: unknown, ctx: CFormFieldEventContext) {
        ElMessage.info(String(ctx.model.city ?? ''))
      },
    },
  },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

---

## isHideItem（条件隐藏）

`true` 隐藏且不占位；函数签名 `(model) => boolean`。

```vue
<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ showExtra: false, extra: '' })
const fields: CFormFieldItem[] = [
  { prop: 'showExtra', label: '显示更多', type: 'switch' },
  {
    prop: 'extra',
    label: '附加',
    type: 'input',
    isHideItem: (m) => m.showExtra !== true,
  },
]
</script>

<template>
  <CForm :model="formData" :fields="fields" />
</template>
```

---

## slotName（整项自定义）

配置后该项**不再**按 `type` 渲染默认控件；`prop` / `label` / `rules` 仍生效。`el-form-item` 带 `slot_label` class。作用域：`model`、`item`。

```vue
<template>
  <CForm :model="formData" :fields="fields">
    <template #customField="{ model, item }">
      <el-input v-model="model[item.prop]" placeholder="插槽内完全自定义" style="width: 100%" />
    </template>
  </CForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ customField: '' })
const fields: CFormFieldItem[] = [
  {
    prop: 'customField',
    label: '自定义',
    type: 'input',
    slotName: 'customField',
  },
]
</script>
```

---

## 底部区域

### showFooterBtns 与 submit 事件

内置「提交」「重置」：提交前执行 `el-form` 校验，通过后 **`emit('submit', model)`**。

```vue
<template>
  <CForm
    :model="formData"
    :fields="fields"
    :options="formOptions"
    @submit="onSubmit"
  />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { FormRules } from 'element-plus'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ name: '' })
const fields: CFormFieldItem[] = [
  { prop: 'name', label: '名称', type: 'input' },
]
const formOptions: CFormOptions = {
  labelWidth: '88px',
  showFooterBtns: true,
  footerSubmitText: '保存',
  footerResetText: '清空',
  footerShowReset: true,
  rules: { name: [{ required: true, message: '必填', trigger: 'blur' }] } satisfies FormRules,
}

function onSubmit(model: Record<string, unknown>) {
  console.log(model)
}
</script>
```

### btnSlotName（底部插槽）

与 `showFooterBtns` **同时配置**时，**仅渲染插槽**。作用域：`model`、`validate`、`resetFields`、`clearValidate`。

```vue
<template>
  <CForm :model="formData" :fields="fields" :options="formOptions">
    <template #formActions="{ validate, resetFields }">
      <el-button type="primary" @click="onSave(validate)">保存</el-button>
      <el-button @click="resetFields">重置</el-button>
    </template>
  </CForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem, CFormOptions } from '@/components/form/types'

const formData = reactive<Record<string, unknown>>({ name: '' })
const fields: CFormFieldItem[] = [
  { prop: 'name', label: '名称', type: 'input' },
]
const formOptions: CFormOptions = {
  labelWidth: '88px',
  btnSlotName: 'formActions',
  footerStyle: { marginTop: '16px' },
  rules: { name: [{ required: true, message: '必填', trigger: 'blur' }] } satisfies FormRules,
}

async function onSave(validate: FormInstance['validate']) {
  try {
    await validate()
    console.log(formData)
  } catch {
    /* 校验未通过 */
  }
}
</script>
```

---

## 暴露的方法（ref）

与持有 `el-form` ref 类似，便于在父组件中手动校验、重置。

```vue
<template>
  <CForm ref="formRef" :model="formData" :fields="fields" />
  <el-button @click="onValidate">校验</el-button>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import CForm from '@/components/form/index.vue'
import type { CFormFieldItem } from '@/components/form/types'

const formRef = ref<InstanceType<typeof CForm> | null>(null)
const formData = reactive<Record<string, unknown>>({ a: '' })
const fields: CFormFieldItem[] = [{ prop: 'a', label: 'A', type: 'input' }]

async function onValidate() {
  try {
    await formRef.value?.validate()
  } catch {
    /* invalid */
  }
}
</script>
```

---

## 类型导出

```ts
import type {
  CFormFieldItem,
  CFormOptions,
  CFormProps,
  CFormFieldType,
  CFormSelectOption,
  CFormFieldBind,
  CFormFieldEvents,
  CFormFieldEventContext,
  CFormFieldSlotProps,
  CFormFieldChildSlotProps,
  CFormTreeSelectSlotProps,
  CFormFooterSlotProps,
} from '@/components/form/types'
```

---

## 依赖

项目需引入 **Element Plus**（示例：`main.ts` 中 `app.use(ElementPlus)`）。更完整演示见 **`src/App.vue`**。
