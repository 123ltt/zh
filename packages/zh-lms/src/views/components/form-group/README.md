## form-group表单可配置组件

### props属性
- `cols` `{String, Number}` 每行列数，默认4
- `size` `{String}` 用于控制该表单域下组件的尺寸，默认mini
- `labelWidth` `{String}` 表单域标签的的宽度，默认60px
- `gutter` `{Number}` 同el-row的栅格间隔
- `model` `{Object}}` 同el-form的表单数据对象
- `formAttrs` `{Object}` el-form-item配置对象

#### formAttrs配置对象参数
- `label` `{String}` 同el-form-item的label标签文本
- `prop` `{String}` 同el-form-item的prop，表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的
- `labelWidth` `{String}` label标签文本的宽度，优选级高于props的labelWidth
- `type` `{String}` 表单类型，可选值：select、GSelect、timeselect、timepicker、date、daterange、datetime、datetimerange、GMultipleInput、text、textarea、switch、radio（后续会增加），若没有适用的可以适用插槽

- `span` `{Number}` 同el-col的栅格占据的列数
- `items` `{Funtion}` 用于GSelect、select、radio的下拉项的list，用法请看例子
- `labelField` `{String}` 用于items中list的label字段修改
- `valueField` `{String}` 用于items中list的value字段修改
- `slot` `{String}` 插槽，同el-form-item的写法
- `attrs` `{Object}` form表单元素的属性，如 multiple: true,  clearable: true, filterable: true 等等
- `events` `{Object}` form表单元素的事件，如 change、click等等

 
```html
<template>
  <formGroup ref="formRef" :model="formData" :gutter="10" class="form-col no-message" label-width="70px" :form-attrs="formAttrs">
    <el-form-item slot="btn" label-width="10px">
      <el-button type="primary">搜索</el-button>
      <el-button type="primary">重置</el-button>
    </el-form-item>
  </formGroup>
</template>

<script>
import formGroup from '@/views/components/form-group/index.vue'
import { getStoreByPlatform } from '@/api/common.js'
import { getDicts } from '@/api/common/dict'
export default {
  data() {
    return {
      formAttrs: [
        { label: '付款时间', prop: 'orderTime', type: 'datetimerange' },
        { label: '抓单时间', prop: 'firstGrabDate', type: 'datetimerange' },
        { label: '订单来源', prop: 'orderStatus', type: 'select', items: (resolve) => this.getDicts(1, resolve) },
        { label: '销售店铺', labelField: 'displayName', valueField: 'displayName', prop: 'storeCode', type: 'select', attrs: { multiple: true, collapseTags: true, clearable: true, filterable: true }, items: this.getStoreCodeList },
        { label: '搜索类型', prop: 'searchType', type: 'radio', span: 8, items: (resolve) => this.getDicts(0, resolve) },
        { labelWidth: '0', prop: 'searchContent', type: 'GMultipleInput', attrs: { 'return-type': 'string', placeholder: '最大支持1000个，换行分割' }, span: 4 },
        { slot: 'btn', span: 4 }
      ],
       formData: {
        orderTime: [],
        firstGrabDate: [],
        orderStatus: '',
        storeCode: '',
        searchType: '1',
        searchContent: '',
        orderType: 'All'
      },
    }
  },
  methods:{
    getStoreCodeList(resolve) { // 获取ebay的销售店铺
      getStoreByPlatform('EB').then(res => {
        resolve(res.data)
      })
    },
    getDicts(type, resolve) {
      getDicts(['plat_search_type', 'plat_order_type'], 'oms').then(res => {
        const data = type ? [{ label: '全部', value: '' }, ...res.plat_order_type] : res.plat_search_type
        resolve(data)
      })
    },
  }
}
</script>
```
