## 单选使用示例
```html
<template>
  <SerachCate :api-fn="getCateogries" :params="params" @get="getData" />
</template>
<script>
import { getCateogries } from '@/api/lazada/category.js'
import serachCate from './serachCate.vue'
export default {
  components: {
    SerachCate
  },
  data() {
    return {
     params: () => {//必须是函数
        return {
          listingStatus: 1,
          name: '',
          siteCode: 'MY',
          a: this.baseProductInfo.productSpu,
          storeName: 'Etecho'
        }
      },
      getCateogries: getCateogries,
    }
  },
  methods: {
    //返回结果
    getData(val) {
      console.log(val, 'ddd')
    },
  }
}
</script>
```
## props
- `paramsKey` `{String}` 查询入参和keyword对应
- `keyField` `{String}` 必填项。每条数据的唯一值对应的字段名（**很重要**）
- `options` `{Object}` 下拉选项显示的内容对应的字段名。默认`name`。传入{label:'label'}则展示label
- `apiFn 查询类目接口`
- `params` `{Function}` 查询入参
## 事件
- `get` 返回结果数据